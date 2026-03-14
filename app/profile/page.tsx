"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const MY_STATES = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan",
  "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah",
  "Sarawak", "Selangor", "Terengganu", "W.P. Kuala Lumpur",
  "W.P. Putrajaya", "W.P. Labuan",
];

const SPECIALISATIONS = [
  "Structural", "Geotechnical", "Hydraulic & Drainage",
  "Transportation & Highway", "Environmental", "Project Management",
  "Construction Management", "Other",
];

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  CONTRIBUTOR: { label: "Contributor", color: "bg-blue-100 text-blue-700" },
  VERIFIER: { label: "Verifier (PE)", color: "bg-green-100 text-green-700" },
  MODERATOR: { label: "Moderator", color: "bg-purple-100 text-purple-700" },
  ADMIN: { label: "Admin", color: "bg-red-100 text-red-700" },
};

interface Profile {
  name: string;
  email: string;
  bemNumber: string | null;
  role: string;
  organisation: string | null;
  state: string | null;
  specialisation: string | null;
  yearsExp: number | null;
  bio: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProfile = useCallback(async () => {
    const res = await fetch("/api/profile");
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      setForm(data);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router, fetchProfile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        bemNumber: form.bemNumber || "",
        organisation: form.organisation || "",
        state: form.state || "",
        specialisation: form.specialisation || "",
        yearsExp: form.yearsExp ? Number(form.yearsExp) : null,
        bio: form.bio || "",
      }),
    });

    setSaving(false);

    if (res.ok) {
      const updated = await res.json();
      setProfile({ ...profile!, ...updated });
      setEditing(false);
      setMessage("Profile updated successfully.");
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to update profile.");
    }
  }

  function update(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (status === "loading" || !profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading profile…</p>
      </div>
    );
  }

  const roleInfo = ROLE_LABELS[profile.role] || ROLE_LABELS.CONTRIBUTOR;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!editing && (
          <button
            onClick={() => {
              setForm(profile);
              setEditing(true);
              setMessage("");
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            message.includes("success")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name || ""}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BEM Registration Number
            </label>
            <input
              type="text"
              value={form.bemNumber || ""}
              onChange={(e) => update("bemNumber", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. PE12345"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organisation
            </label>
            <input
              type="text"
              value={form.organisation || ""}
              onChange={(e) => update("organisation", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                value={form.state || ""}
                onChange={(e) => update("state", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select state</option>
                {MY_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialisation
              </label>
              <select
                value={form.specialisation || ""}
                onChange={(e) => update("specialisation", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select area</option>
                {SPECIALISATIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min={0}
              max={60}
              value={form.yearsExp ?? ""}
              onChange={(e) => update("yearsExp", e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={form.bio || ""}
              onChange={(e) => update("bio", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="A brief introduction about yourself…"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setForm(profile);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Profile card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-start gap-4">
              {/* Avatar placeholder */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {profile.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-sm text-gray-500">{profile.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${roleInfo.color}`}
                  >
                    {roleInfo.label}
                  </span>
                  {profile.bemNumber && (
                    <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      BEM: {profile.bemNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {profile.bio && (
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Details grid */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Professional Details
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Organisation</dt>
                <dd className="font-medium text-gray-900">
                  {profile.organisation || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">State</dt>
                <dd className="font-medium text-gray-900">
                  {profile.state || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Specialisation</dt>
                <dd className="font-medium text-gray-900">
                  {profile.specialisation || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Experience</dt>
                <dd className="font-medium text-gray-900">
                  {profile.yearsExp != null ? `${profile.yearsExp} years` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Member Since</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString("en-MY", {
                    year: "numeric",
                    month: "long",
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
