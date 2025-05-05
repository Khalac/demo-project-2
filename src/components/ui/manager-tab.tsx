import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { ReactNode } from "react";

type Manager = {
  user_id: string;
  full_name: string;
};

export const ManagerTab = <M extends Manager, List>({
  children,
  manager,
  fn,
  data,
  dataManager,
  loading,
  loadingGetManager,
}: {
  children: (data: List[], loading: boolean) => ReactNode;
  manager: M[] | undefined;
  fn: (e: string) => Promise<void>;
  data: List[] | undefined;
  dataManager: List[] | undefined;
  loading: boolean;
  loadingGetManager: boolean;
}) => {
  return (
    <Tabs defaultValue="all" className="w-full h-full">
      <div className="flex justify-center items-center gap-2">
        <TabsList className="cursor-pointer">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-black data-[state=active]:text-white px-3 py-4"
          >
            All
          </TabsTrigger>
        </TabsList>
        {manager &&
          manager.map((m) => {
            return (
              <TabsList className="cursor-pointer">
                <TabsTrigger
                  key={m.user_id}
                  value={m.user_id}
                  onClick={() => fn(m.user_id)}
                  className="text-xs px-3 py-4 rounded-md data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  {m.full_name}
                </TabsTrigger>
              </TabsList>
            );
          })}
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
