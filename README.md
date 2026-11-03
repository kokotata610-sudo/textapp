# Browser Transcription

A lightweight browser-based live transcription app. It uses the browser's built-in
speech recognition, so no audio is uploaded to this repository or an app server.
Depending on the browser, speech recognition may be processed by a browser
provider's online service.

## Use

Open the published GitHub Pages site in a supported browser, choose a language,
and select **Start transcription**. Allow microphone access when prompted. You
can copy or download the transcript as a text file.

Speech recognition support varies by browser. Current Chromium-based browsers
such as Chrome and Edge are recommended; this app does not upload pre-recorded
audio files.

## Publish with GitHub Pages

The GitHub Actions workflow in `.github/workflows/pages.yml` deploys the site
when a branch is pushed and enables Pages if needed. If the workflow cannot
enable Pages, set **Settings > Pages > Build and deployment > Source** to
**GitHub Actions** and rerun it.

The site URL is `https://<owner>.github.io/<repository>/`.
