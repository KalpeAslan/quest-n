import { EWebhookTaskTabs, ILoyaltyTask } from "@/models";
import { useEffect, useMemo, useState } from "react";

interface Props {
  task: ILoyaltyTask;
}

const useWebhookTabs = ({ task }: Props) => {
  const [activeTab, setActiveTab] = useState<EWebhookTaskTabs>(
    task?.body?.webhookDetails?.userInput?.inputOptions?.[0] ||
      EWebhookTaskTabs.PHONE,
  );

  const inputOptions = useMemo(
    () =>
      (task?.body?.webhookDetails?.userInput?.inputOptions ||
        []) as EWebhookTaskTabs[],
    [task],
  );

  const tabs = useMemo(
    () =>
      inputOptions.map((item, index) => ({
        id: index,
        title: item[0].toUpperCase() + item.slice(1),
        tab: item,
      })),
    [inputOptions],
  );

  useEffect(() => {
    setActiveTab(inputOptions[0] || EWebhookTaskTabs.PHONE);
  }, [inputOptions]);

  return { tabs, activeTab, setActiveTab };
};

export default useWebhookTabs;
