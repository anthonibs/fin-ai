import { db } from "@/app/_lib/prisma";
import { DashboardService } from "@/app/modules/dashboard/services/dashboard.service";
import {
  DashboardMetrics,
  GetDashboardParams,
} from "@/app/modules/dashboard/types/dashboard.types";

export const getDashboard = async (params: GetDashboardParams): Promise<DashboardMetrics> => {
  const service = new DashboardService(db);
  return service.execute(params);
};

export default getDashboard;
