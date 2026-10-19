import { ActiveCollaborator, CollaborationMessage } from '../types/project';

type Listener = (msg: CollaborationMessage) => void;
type CollaboratorsListener = (collaborators: ActiveCollaborator[]) => void;

class CollaborationChannel {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<Listener> = new Set();
  private collaboratorListeners: Set<CollaboratorsListener> = new Set();
  private collaborators: Map<string, ActiveCollaborator> = new Map();
  private pingInterval: number | null = null;
  private currentUserId: string = '';
  private currentUserName: string = '';
  private currentUserRole: string = '';
  private currentUserColor: string = '#2563eb';
  private currentProjectId: string = '';
  private currentMemberId: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('stahleuro_collab_bus');
        this.channel.onmessage = (event) => {
          this.handleIncoming(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported or blocked:', e);
      }
    }
  }

  public init(
    userId: string,
    userName: string,
    userRole: string,
    userColor: string,
    projectId: string,
    memberId: string
  ) {
    this.currentUserId = userId;
    this.currentUserName = userName;
    this.currentUserRole = userRole;
    this.currentUserColor = userColor;
    this.currentProjectId = projectId;
    this.currentMemberId = memberId;

    // Register self
    this.collaborators.set(userId, {
      id: userId,
      name: userName,
      role: userRole,
      color: userColor,
      activeMemberId: memberId,
      lastPing: Date.now(),
    });

    // Broadcast join
    this.broadcast({
      type: 'USER_JOIN',
      userId,
      userName,
      userRole,
      userColor,
      timestamp: new Date().toISOString(),
      projectId,
      memberId,
    });

    // Start heartbeat ping every 4 seconds
    if (this.pingInterval) clearInterval(this.pingInterval);
    this.pingInterval = window.setInterval(() => {
      this.heartbeat();
    }, 4000);
  }

  private heartbeat() {
    if (!this.currentUserId) return;
    this.broadcast({
      type: 'USER_JOIN',
      userId: this.currentUserId,
      userName: this.currentUserName,
      userRole: this.currentUserRole,
      userColor: this.currentUserColor,
      timestamp: new Date().toISOString(),
      projectId: this.currentProjectId,
      memberId: this.currentMemberId,
    });

    // Clean up stale collaborators (no ping for 10 seconds)
    const now = Date.now();
    let changed = false;
    this.collaborators.forEach((collab, id) => {
      if (id !== this.currentUserId && now - collab.lastPing > 10000) {
        this.collaborators.delete(id);
        changed = true;
      }
    });
    if (changed) {
      this.notifyCollaborators();
    }
  }

  public setFocusMember(memberId: string) {
    this.currentMemberId = memberId;
    const self = this.collaborators.get(this.currentUserId);
    if (self) {
      self.activeMemberId = memberId;
      self.lastPing = Date.now();
      this.notifyCollaborators();
    }
  }

  public broadcast(msg: CollaborationMessage) {
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (e) {}
    }
  }

  private handleIncoming(msg: CollaborationMessage) {
    if (!msg || !msg.userId) return;

    // Update collaborator presence
    this.collaborators.set(msg.userId, {
      id: msg.userId,
      name: msg.userName,
      role: msg.userRole,
      color: msg.userColor,
      activeMemberId: msg.memberId,
      lastPing: Date.now(),
    });
    this.notifyCollaborators();

    // Call message listeners
    this.listeners.forEach((listener) => {
      try {
        listener(msg);
      } catch (e) {
        console.error('Error in collab listener:', e);
      }
    });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeCollaborators(listener: CollaboratorsListener): () => void {
    this.collaboratorListeners.add(listener);
    listener(Array.from(this.collaborators.values()));
    return () => {
      this.collaboratorListeners.delete(listener);
    };
  }

  private notifyCollaborators() {
    const list = Array.from(this.collaborators.values());
    this.collaboratorListeners.forEach((fn) => fn(list));
  }

  public destroy() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}

export const collaborationBus = new CollaborationChannel();
