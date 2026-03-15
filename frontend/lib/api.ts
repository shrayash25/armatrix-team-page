/**
 * Centralized API helper for the Armatrix Team Page.
 * All team-related API calls go through this module.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** Shape of a team member returned by the backend. */
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    department: string;
    bio: string;
    photo_url: string;
    linkedin_url: string;
    twitter_url: string | null;
    created_at: string;
}

/** Payload for creating a new team member. */
export interface TeamMemberCreate {
    name: string;
    role: string;
    department: string;
    bio: string;
    photo_url: string;
    linkedin_url: string;
    twitter_url?: string;
}

/** Payload for updating a team member (all fields optional). */
export type TeamMemberUpdate = Partial<TeamMemberCreate>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.detail || `API error: ${res.status}`);
    }

    // 204 No Content (e.g. DELETE)
    if (res.status === 204) return undefined as T;

    return res.json();
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getTeamMembers(): Promise<TeamMember[]> {
    return request<TeamMember[]>("/team/");
}

export async function getTeamMember(id: string): Promise<TeamMember> {
    return request<TeamMember>(`/team/${id}`);
}

export async function createTeamMember(
    data: TeamMemberCreate
): Promise<TeamMember> {
    return request<TeamMember>("/team/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateTeamMember(
    id: string,
    data: TeamMemberUpdate
): Promise<TeamMember> {
    return request<TeamMember>(`/team/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteTeamMember(id: string): Promise<void> {
    return request<void>(`/team/${id}`, { method: "DELETE" });
}
