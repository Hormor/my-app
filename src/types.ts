export type Attendee = {
  dateCreated: string;
  name: string;
  email: string;
  id: string;
};

export type Chat = {
  dateCreated: string;
  message: string;
  sender: Attendee;
};

export type Talk = {
  attendees: Array<Attendee>;
  chats: Array<Chat>;
  id: string;
  title: string;
};
