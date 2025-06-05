import { Job } from './job';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  JobDetail: { job: Job };
  EquipmentRemark: { equipmentId: string };
};
