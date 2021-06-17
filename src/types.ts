export interface Speaker {
  id: number;
  name: string;
}

export interface Dialog {
  startTime: number;
  endTime: number;
  speaker: number;
  words: string;
}

export interface SaveToQuipRequest {
  documentId: string;
  dialogs: Dialog[];
  speakers: Speaker[];
}
