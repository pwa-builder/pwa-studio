export interface Question {
  type: string;
  name: string;
  message: string;
  default?: string;
  choices?: string[];
  validate?: Function;
}

export interface MsixInfo {
  name?: string;
  packageId: string;
  url?: string;
  version: string;
  allowSigning: boolean;
  classicPackage: ClassicPackage;
  publisher?: Publisher;
}

interface ClassicPackage {
  generate: boolean;
  version: string;
}

interface Publisher {
  displayName: string;
  commonName: string;
}
