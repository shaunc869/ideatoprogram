"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const MAX_CHARS = 500;

export default function Comments({ lessonId }: { lessonId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?lessonId=${lessonId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchComments();

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.id) setCurrentUserId(data.id);
      })
      .catch(() => {});
  }, [fetchComments]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || text.length > MAX_CHARS) return;

    setPosting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, text: text.trim() }),
      });

      if (res.status === 401) {
        setNeedsLogin(true);
        return;
      }

      if (res.ok) {
        setText("");
        await fetchComments();
      }
    } catch {
      // ignore
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(commentId: string) {
    try {
      const res = await fetch(`/api/comments?commentId=${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>

      {/* Comment Form */}
      {needsLogin ? (
        <p className="text-gray-400 text-sm mb-4">
          <a href="/login" className="text-indigo-400 hover:text-indigo-300 underline">
            Sign in
          </a>{" "}
          to comment.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_CHARS}
            rows={3}
            placeholder="Add a comment..."
            className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 resize-none mb-1"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {text.length}/{MAX_CHARS}
            </span>
            <button
              type="submit"
              disabled={posting || !text.trim()}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-[#334155]/50 last:border-0 pb-3 last:pb-0"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{comment.userName}</span>
                  <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
                </div>
                {currentUserId && currentUserId === comment.userId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-300">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
