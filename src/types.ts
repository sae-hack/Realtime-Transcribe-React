export interface Dialog {
  dialogId: string;
  startTime: number;
  endTime: number;
  speaker: number;
  words: string;
}

export interface SaveToQuipRequest {
  documentUrl: string;
  content: string;
}
