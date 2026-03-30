import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface CreateJobRequest {
    roomImageBlob: ExternalBlob;
    decorItems: Array<DecorItem>;
    style: Style;
}
export interface JobOutput {
    description: string;
    imageId: string;
}
export interface DesignJob {
    timerange: Time;
    status: JobStatus;
    output?: JobOutput;
    userId: UserId;
    jobId: bigint;
    decorItems: Array<DecorItem>;
    style: Style;
}
export type UserId = Principal;
export type DecorItem = string;
export interface CreateJobResponse {
    status: JobStatus;
    jobId: bigint;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export enum JobStatus {
    pending = "pending",
    completed = "completed",
    processing = "processing",
    failed = "failed"
}
export enum Style {
    indianTraditional = "indianTraditional",
    scandinavian = "scandinavian",
    minimalist = "minimalist",
    modern = "modern",
    luxury = "luxury"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createJob(request: CreateJobRequest): Promise<CreateJobResponse>;
    getAllJobs(): Promise<Array<DesignJob>>;
    getCallerJobs(): Promise<Array<DesignJob>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDecorItems(): Promise<Array<DecorItem>>;
    getJobById(jobId: bigint): Promise<DesignJob | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateJobStatus(jobId: bigint, status: JobStatus): Promise<void>;
}
