export type EditWard = {
  wardname: string;
  id: string;
  managerName: string;
  managerEmail: string;
};

export type EditWardField = {
  name: keyof EditWard;
  label: string;
  placeholder: string;
};
