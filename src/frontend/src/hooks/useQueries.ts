import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateJobRequest, DesignJob, UserProfile } from "../backend";
import { useActor } from "./useActor";

export function useGetCallerJobs() {
  const { actor, isFetching } = useActor();
  return useQuery<DesignJob[]>({
    queryKey: ["callerJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJobById(jobId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<DesignJob | null>({
    queryKey: ["job", jobId?.toString()],
    queryFn: async () => {
      if (!actor || jobId === null) return null;
      return actor.getJobById(jobId);
    },
    enabled: !!actor && !isFetching && jobId !== null,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2000;
      if (data.status === "pending" || data.status === "processing")
        return 2000;
      return false;
    },
  });
}

export function useCreateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: CreateJobRequest) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createJob(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerJobs"] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}
