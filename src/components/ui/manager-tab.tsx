import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { ReactNode } from "react";

type Manager = {
  user_id: string;
  full_name: string;
};

export const ManagerTab = <M extends Manager, L>({
  children,
  manager,
  fn,
  data,
  dataManager,
  loading,
  loadingGetManager,
}: {
  children: (data: L[], loading: boolean) => ReactNode;
  manager: M[] | undefined;
  fn: (e: string) => Promise<void>;
  data: L[] | undefined;
  dataManager: L[] | undefined;
  loading: boolean;
  loadingGetManager: boolean;
}) => {
  return (
    <Tabs defaultValue="all" className="w-full h-full">
      <div className="flex justify-center items-center gap-5">
        <TabsList className="cursor-pointer">
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsList className="gap-2 cursor-pointer">
          {manager &&
            manager.map((m) => {
              return (
                <TabsTrigger
                  key={m.user_id}
                  value={m.user_id}
                  onClick={() => fn(m.user_id)}
                >
                  {m.full_name}
                </TabsTrigger>
              );
            })}
        </TabsList>
      </div>
      <TabsContent value="all">
        {data && (
          <div className="flex flex-col gap-5">{children(data, loading)}</div>
        )}
      </TabsContent>
      {manager &&
        manager.map((m) => {
          return (
            <TabsContent key={m.user_id} value={m.user_id}>
              {dataManager && (
                <div className="flex flex-col gap-5">
                  {children(dataManager, loadingGetManager)}
                </div>
              )}
            </TabsContent>
          );
        })}
    </Tabs>
  );
};
