export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum StatusProjectEnum {
  PENDING = 'pending',
  DONE = 'done',
  ON_PROGRESS = 'on_progress',
  CLOSED = 'closed',
}

export enum PositionEnum {
  FE = 'fe',
  BE = 'be',
  FULLSTACK = 'fullstack',
  BA = 'ba',
  QA = 'qa',
  DEVOPS = 'devops',
  UX_UI = 'ux_ui',
}

export function getFormattedPosition(position: PositionEnum): string {
  switch (position) {
    case PositionEnum.FE:
      return 'Front-end Developer';
    case PositionEnum.BE:
      return 'Back-end Developer';
    case PositionEnum.FULLSTACK:
      return 'Full Stack Developer';
    case PositionEnum.BA:
      return 'Business Analyst';
    case PositionEnum.QA:
      return 'Quality Assurance';
    case PositionEnum.DEVOPS:
      return 'DevOps';
    case PositionEnum.UX_UI:
      return 'UX/UI';
    default:
      return '';
  }
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
