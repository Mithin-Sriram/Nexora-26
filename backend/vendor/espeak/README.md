# Bundled offline speech runtime

This directory contains the Ubuntu 24.04 x86-64 eSpeak NG 1.51 runtime,
libraries, and speech data required by the backend's offline WAV synthesis
endpoint. The backend launches this local executable and uses these local voice
data files; it does not download software, voices, or audio from a service at
runtime.

Retained package copyright and license notices are under
`usr/share/doc/<package>/copyright`. The eSpeak NG program and data are
distributed under GPL-3.0-or-later, with additional third-party notices listed
in those files. Runtime packages included here are `espeak-ng`, `espeak-ng-data`,
`libespeak-ng1`, `libpcaudio0`, and `libsonic0`.

This prebuilt runtime is for x86-64 Linux and relies on the host's standard
system shared libraries. Other operating systems and CPU architectures need
their matching eSpeak NG runtime packaged at these paths.
