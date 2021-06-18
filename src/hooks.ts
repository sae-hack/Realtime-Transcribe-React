import { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Dialog } from "./types";
// import MicrophoneStream from "microphone-stream";
// import {
//   convertAudioToBinaryMessage,
//   createPresignedUrl,
// } from "../public/amazon-transcribe-websocket-static/main";
// import { eventStreamMarshaller } from "../public/amazon-transcribe-websocket-static/marshaller";

type CognitoUserTweaked = CognitoUser & {
  username?: string;
  attributes?: {
    email: string;
    email_verified: boolean;
  };
};

export const useUser = (): CognitoUserTweaked | undefined =>
  useContext(UserContext);

export const useTranscribe = (credential: any, region: string, stop: any) => {
  const [transcription, setTranscription] = useState<Dialog[]>([]);
  const [partial, setPartial] = useState<string>("");
  const [error, setError] = useState<string>();

  const handleEventStreamMessage = useCallback((messageJson: any) => {
    const results = messageJson.Transcript.Results;

    if (results.length > 0) {
      if (results[0].Alternatives.length > 0) {
        let transcript = results[0].Alternatives[0].Transcript;

        // fix encoding for accented characters
        transcript = decodeURIComponent(escape(transcript));

        if (results[0].IsPartial) {
          setPartial(transcript);
        } else {
          setPartial("");
          setTranscription((t: Dialog[]) => {
            const dialogsToAppend: Dialog[] = [];
            for (const item of results[0].Alternatives[0].Items) {
              const speaker = item.Speaker;
              const text = item.Content;
              const type = item.Type;
              const startTime = item.StartTime;
              const endTime = item.EndTime;

              const lastDialog =
                dialogsToAppend.length > 0
                  ? dialogsToAppend[dialogsToAppend.length - 1]
                  : undefined;

              if (!lastDialog || type === "speaker-change") {
                dialogsToAppend.push({
                  speaker,
                  words: text,
                  startTime,
                  endTime,
                });
              } else {
                dialogsToAppend.pop();
                dialogsToAppend.push({
                  ...lastDialog,
                  words:
                    lastDialog.words +
                    (type === "pronunciation" ? " " : "") +
                    text,
                  endTime,
                });
              }
            }
            return [...t, ...dialogsToAppend];
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (credential && region && !stop) {
      (window as any).handleEventStreamMessage = handleEventStreamMessage;
      (window as any).region = region;
      (window as any).access_id = credential.AccessKeyId;
      (window as any).secret_key = credential.SecretAccessKey;
      (window as any).session_token = credential.SessionToken;
      (window as any).startTranscribe();
    }
    else if (stop){
      (window as any).closeSocket();
      console.log("stop button clicked");
    }
  }, [credential, region, handleEventStreamMessage, stop]);

  return {
    transcription,
    partial,
    error,
  };
};

// const useUserMedia = (): MediaStream | undefined => {
//   const [userMediaStream, setUserMediaStream] =
//     useState<MediaStream | undefined>(undefined);

//   useEffect(() => {
//     window.navigator.mediaDevices
//       .getUserMedia({
//         video: false,
//         audio: true,
//       })
//       .then(setUserMediaStream)
//       .catch(() => {
//         alert("Cannot find the microphone");
//       });
//   }, []);

//   return userMediaStream;
// };

// const useMicStream = () => {
//   const [micStream, setMicStream] =
//     useState<MicrophoneStream | undefined>(undefined);
//   const [inputSampleRate, setInputSampleRate] = useState();
//   const userMediaStream = useUserMedia();

//   useEffect(() => {
//     if (userMediaStream) {
//       console.log("creating mic stream");
//       const stream = new MicrophoneStream();
//       (stream as any).on("format", (data: any) => {
//         setInputSampleRate(data.sampleRate);
//       });

//       stream.setStream(userMediaStream);

//       (window as any).micStream = stream;
//       setMicStream(stream);
//     }
//   }, [userMediaStream]);

//   return { micStream, inputSampleRate };
// };

// export const useWebSocket = (credential: any, region: string) => {
//   const [transcription, setTranscription] = useState<string>("");
//   const [partial, setPartial] = useState<string>("");
//   const [error, setError] = useState<string>();

//   const handleEventStreamMessage = useCallback((messageJson: any) => {
//     const results = messageJson.Transcript.Results;

//     if (results.length > 0) {
//       if (results[0].Alternatives.length > 0) {
//         let transcript = results[0].Alternatives[0].Transcript;

//         // fix encoding for accented characters
//         transcript = decodeURIComponent(escape(transcript));

//         if (results[0].IsPartial) {
//           setPartial(transcript);
//         } else {
//           setPartial("");
//           setTranscription((t) => t + transcript + "\n");
//         }
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (micStream && credential) {
//       const url = createPresignedUrl(
//         credential.AccessKeyId,
//         credential.SecretAccessKey,
//         credential.SessionToken,
//         region
//       ) as string;

//       //open up our WebSocket connection
//       const socket = new WebSocket(url);
//       socket.binaryType = "arraybuffer";

//       // when we get audio data from the mic, send it to the WebSocket if possible
//       socket.onopen = function () {
//         (micStream as any).on("data", function (rawAudioChunk: any) {
//           console.log("ondata");
//           // the audio stream is raw audio bytes. Transcribe expects PCM with additional metadata, encoded as binary
//           const binary = convertAudioToBinaryMessage(
//             rawAudioChunk,
//             inputSampleRate
//           );

//           if (socket.readyState === socket.OPEN) socket.send(binary as any);
//         });
//       };

//       // handle messages, errors, and close events
//       // handle inbound messages from Amazon Transcribe
//       socket.onmessage = function (message) {
//         //convert the binary event stream message to JSON
//         const messageWrapper = eventStreamMarshaller.unmarshall(
//           Buffer.from(message.data)
//         );
//         const messageBody = JSON.parse(
//           String.fromCharCode(...messageWrapper.body)
//         );
//         if (messageWrapper.headers[":message-type"].value === "event") {
//           handleEventStreamMessage(messageBody);
//         } else {
//           setError(messageBody.Message);
//           // TODO: stop
//         }
//       };

//       socket.onerror = function () {
//         setError("WebSocket connection error. Try again.");
//         // TODO: stop
//       };

//       socket.onclose = function (closeEvent) {
//         console.log("closing websocket");
//         micStream.stop();

//         // TODO: stop
//       };
//     }
//   }, [
//     handleEventStreamMessage,
//     micStream,
//     inputSampleRate,
//     credential,
//     region,
//   ]);

//   return {
//     transcription,
//     partial,
//     error,
//   };
// };
