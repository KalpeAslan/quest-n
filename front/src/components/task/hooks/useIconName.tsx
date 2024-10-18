import { ELoyaltyTasks, ILoyaltyTask } from "@/models";
import { icons, statusIcons } from "@/modules/quest/models/constants";
import { useMemo } from "react";

interface Props {
  task: ILoyaltyTask;
  status: {
    isBlocked: boolean;
    isExpired: boolean;
    isDone: boolean;
    isActive: boolean;
    isSoon: boolean;
  };
  activeStep: number;
}

const useIconName = ({ task, status, activeStep }: Props) => {
  const iconName = useMemo(() => {
    if (task.type === "daily" && task.body.subTasks) {
      if (
        task.body.subTasks[activeStep].status === "expired" ||
        task.body.subTasks[activeStep].status === "rejected"
      )
        return statusIcons.expired;

      if (task.body.subTasks[activeStep].status === "confirmed")
        return statusIcons.done;
    }

    if (task.type === ELoyaltyTasks.INVITE) {
      if (status.isBlocked || status.isSoon) return statusIcons.blocked;
      if (status.isExpired) return statusIcons.expired;
      return icons[task.type];
    }

    if (status.isBlocked || status.isSoon) return statusIcons.blocked;
    if (status.isDone) return statusIcons.done;
    if (status.isExpired) return statusIcons.expired;
    return icons[task.type];
  }, [status, activeStep, task]);

  return iconName;
};

export default useIconName;
