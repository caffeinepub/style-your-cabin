import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import OutCall "http-outcalls/outcall";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Int "mo:core/Int";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type UserId = Principal;
  type DecorItem = Text;

  type Style = {
    #modern;
    #minimalist;
    #luxury;
    #scandinavian;
    #indianTraditional;
  };

  module Style {
    public func compare(style1 : Style, style2 : Style) : Order.Order {
      switch (style1, style2) {
        case (#modern, #modern) { #equal };
        case (#modern, _) { #less };
        case (#minimalist, #modern) { #greater };
        case (#minimalist, #minimalist) { #equal };
        case (#minimalist, _) { #less };
        case (#luxury, #luxury) { #equal };
        case (#luxury, _) { #less };
        case (#scandinavian, #scandinavian) { #equal };
        case (#scandinavian, _) { #less };
        case (#indianTraditional, #indianTraditional) { #equal };
        case (#indianTraditional, _) { #less };
      };
    };
  };

  type JobResult = {
    description : Text;
    imageUrl : Text;
  };

  type JobStatus = {
    #pending;
    #processing;
    #completed;
    #failed;
  };

  type JobInput = {
    roomImageBlob : Storage.ExternalBlob;
    timerange : Time.Time;
    style : Style;
    decorItems : [DecorItem];
  };

  type JobOutput = {
    description : Text;
    imageId : Text;
  };

  type DesignJob = {
    jobId : Nat;
    userId : UserId;
    style : Style;
    decorItems : [DecorItem];
    timerange : Time.Time;
    status : JobStatus;
    output : ?JobOutput;
  };

  module DesignJob {
    public func compare(job1 : DesignJob, job2 : DesignJob) : Order.Order {
      Nat.compare(job1.jobId, job2.jobId);
    };

    public func compareByUserId(job1 : DesignJob, job2 : DesignJob) : Order.Order {
      Principal.compare(job1.userId, job2.userId);
    };
    public func compareByTimeRange(job1 : DesignJob, job2 : DesignJob) : Order.Order {
      Int.compare(job1.timerange, job2.timerange);
    };
    public func compareByStatus(job1 : DesignJob, job2 : DesignJob) : Order.Order {
      switch (job1.status, job2.status) {
        case (#pending, #pending) { #equal };
        case (#pending, _) { #less };
        case (#processing, #pending) { #greater };
        case (#processing, #processing) { #equal };
        case (#processing, _) { #less };
        case (#completed, #completed) { #equal };
        case (#completed, _) { #less };
        case (#failed, #failed) { #equal };
        case (#failed, _) { #less };
      };
    };
    public func compareByStyle(job1 : DesignJob, job2 : DesignJob) : Order.Order {
      Style.compare(job1.style, job2.style);
    };
  };

  public type CreateJobRequest = {
    style : Style;
    decorItems : [DecorItem];
    roomImageBlob : Storage.ExternalBlob;
  };

  type ImageId = Blob;

  public type CreateJobResponse = {
    jobId : Nat;
    status : JobStatus;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextJobId = 0;
  let decorItems = Set.fromArray(["sofa", "lamp", "table", "plant", "bookshelf", "rug", "curtains", "artwork", "mirror", "coffee table"]);
  let designJobs = Map.empty<Nat, DesignJob>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func updateJobStatusInternal(jobId : Nat, status : JobStatus) {
    switch (designJobs.get(jobId)) {
      case (?job) {
        let updatedJob : DesignJob = {
          job with
          status;
        };
        designJobs.add(jobId, updatedJob);
      };
      case (null) { Runtime.trap("Job does not exist") };
    };
  };

  func createJobInternal(user : UserId, style : Style, decorateItems : [DecorItem]) : Nat {
    let jobId = nextJobId;
    nextJobId += 1;
    let newJob : DesignJob = {
      jobId;
      userId = user;
      status = #pending;
      style;
      timerange = Time.now();
      decorItems = decorateItems;
      output = null;
    };
    designJobs.add(jobId, newJob);
    jobId;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getJobById(jobId : Nat) : async ?DesignJob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view jobs");
    };
    switch (designJobs.get(jobId)) {
      case (?job) {
        // Users can only view their own jobs, admins can view all jobs
        if (job.userId == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?job;
        } else {
          Runtime.trap("Unauthorized: Can only view your own jobs");
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getCallerJobs() : async [DesignJob] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view jobs");
    };
    designJobs.values().toArray().filter(func(job) { job.userId == caller });
  };

  public query ({ caller }) func getAllJobs() : async [DesignJob] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch all jobs");
    };
    designJobs.toArray().map(func((_, job)) { job });
  };

  public shared ({ caller }) func createJob(request : CreateJobRequest) : async CreateJobResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create jobs");
    };
    let jobId = createJobInternal(caller, request.style, request.decorItems);
    {
      jobId;
      status = #pending;
      timestamp = Time.now();
    };
  };

  public shared ({ caller }) func updateJobStatus(jobId : Nat, status : JobStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update job status");
    };
    updateJobStatusInternal(jobId, status);
  };

  public query func getDecorItems() : async [DecorItem] {
    decorItems.toArray();
  };
};
