// SPDX-FileCopyrightText: 2023 Iván Szkiba
// SPDX-FileCopyrightText: 2023 Raintank, Inc. dba Grafana Labs
//
// SPDX-License-Identifier: AGPL-3.0-only
// SPDX-License-Identifier: MIT

package dashboard

import (
	"bytes"
	"errors"
	"io/fs"
	"net"
	"net/http"
	"path"
	"strings"
	"time"

	"github.com/sirupsen/logrus"
)

const (
	pathEvents = "/events"
	pathUI     = "/ui/"
	pathReport = "/report"

	eventChannel    = "events"
	snapshotEvent   = "snapshot"
	cumulativeEvent = "cumulative"
	startEvent      = "start"
	stopEvent       = "stop"
	configEvent     = "config"
	metricEvent     = "metric"
	paramEvent      = "param"
	thresholdEvent  = "threshold"
)

type webServer struct {
	*eventEmitter
	*http.ServeMux
	server      *http.Server
	defaultLang string
}

func newWebServer(
	uiFS fs.FS,
	reportHandler http.Handler,
	logger logrus.FieldLogger,
	defaultLang string,
) *webServer { //nolint:ireturn
	srv := &webServer{
		eventEmitter: newEventEmitter(eventChannel, logger),
		ServeMux:     http.NewServeMux(),
		defaultLang:  defaultLang,
	}

	srv.Handle(pathEvents, srv.eventEmitter)
	srv.Handle(pathUI, http.StripPrefix(pathUI, srv.uiHandler(uiFS)))
	srv.Handle(pathReport, reportHandler)

	srv.HandleFunc("/", rootHandler(pathUI, srv.defaultLang))

	srv.server = &http.Server{
		Handler:           srv.ServeMux,
		ReadHeaderTimeout: time.Second,
	} //nolint:exhaustruct

	return srv
}

// uiHandler wraps the UI file server to inject language configuration
func (srv *webServer) uiHandler(uiFS fs.FS) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if this is an HTML file that needs language injection
		if strings.HasSuffix(r.URL.Path, ".html") || r.URL.Path == "/" || r.URL.Path == "" {
			// Read the file content
			file, err := uiFS.Open(strings.TrimPrefix(r.URL.Path, "/"))
			if err != nil {
				http.NotFound(w, r)
				return
			}
			defer file.Close()

			content, err := fs.ReadFile(uiFS, strings.TrimPrefix(r.URL.Path, "/"))
			if err != nil {
				http.NotFound(w, r)
				return
			}

			// Inject language configuration if it's an HTML file
			if bytes.Contains(content, []byte("<head>")) && srv.defaultLang != "" {
				langScript := []byte("\n<script>window.__DASHBOARD_LANG__='" + srv.defaultLang + "';</script>\n")
				content = srv.injectIntoHTML(content, []byte("<head>"), langScript)
			}

			// Set content type
			if strings.HasSuffix(r.URL.Path, ".html") || r.URL.Path == "/" || r.URL.Path == "" {
				w.Header().Set("Content-Type", "text/html; charset=utf-8")
			}

			w.Write(content)
			return
		}

		// For non-HTML files, serve normally
		http.FileServer(http.FS(uiFS)).ServeHTTP(w, r)
	})
}

// injectIntoHTML injects content after a specific tag
func (srv *webServer) injectIntoHTML(html []byte, tag []byte, insertContent []byte) []byte {
	idx := bytes.Index(html, tag)
	if idx < 0 {
		return html // Return original if tag not found
	}

	idx += len(tag)

	// Insert content after the tag
	result := make([]byte, 0, len(html)+len(insertContent))
	result = append(result, html[:idx]...)
	result = append(result, insertContent...)
	result = append(result, html[idx:]...)
	return result
}

func (srv *webServer) listenAndServe(addr string) (*net.TCPAddr, error) {
	listener, err := net.Listen("tcp", addr)
	if err != nil {
		return nil, err
	}

	go func() {
		serr := srv.server.Serve(listener)
		if serr != nil && !errors.Is(serr, http.ErrServerClosed) {
			srv.logger.Error(serr)
		}
	}()

	a, _ := listener.Addr().(*net.TCPAddr)

	return a, nil
}

func (srv *webServer) stop() error {
	srv.Close()

	err := srv.server.Close()
	if err != nil && !errors.Is(err, http.ErrServerClosed) {
		return err
	}

	return nil
}

func rootHandler(uiPath string, defaultLang string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) { //nolint:varnamelen
		if r.URL.Path == "/" {
			// preserve existing query string (e.g., lang) while ensuring endpoint param
			q := r.URL.RawQuery
			// ensure lang param if not present
			if q == "" {
				q = "lang=" + defaultLang
			} else if !hasLangParam(q) && defaultLang != "" {
				q = q + "&lang=" + defaultLang
			}
			if q == "" {
				q = "endpoint=/"
			} else {
				q = q + "&endpoint=/"
			}

			http.Redirect(
				w,
				r,
				path.Join(uiPath, r.URL.Path)+"?"+q,
				http.StatusTemporaryRedirect,
			)

			return
		}

		http.NotFound(w, r)
	}
}

func hasLangParam(rawQuery string) bool {
	// naive check without full parsing
	return strings.Contains(rawQuery, "lang=")
}
