import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";

const production = !process.env.ROLLUP_WATCH;

function proxy() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;
        // Listen on a specific host via the HOST environment variable
        var host = process.env.HOST || "localhost";
        // Listen on a specific port via the PORT environment variable
        var port = process.env.PORT || 8080;

        var cors_proxy = require("cors-anywhere");
        cors_proxy
          .createServer({
            originWhitelist: [], // Allow all origins
            requireHeader: ["origin", "x-requested-with"],
            removeHeaders: ["cookie", "cookie2"],
          })
          .listen(port, host, function () {
            console.log("Running CORS Anywhere on " + host + ":" + port);
          });
      }
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/bundle.js",
  },
  plugins: [
    replace({
      CORS_URL_PROXY: !production
        ? ""
        : "https://svelte-new-vercel.vercel.app:8080/",
    }),
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: (css) => {
        css.write("public/bundle.css");
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({ browser: true }),
    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),
    !production && proxy(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
