import { useState } from 'react';
import slugify from 'slugify';

interface CreateArticleFormProps {
    apiUrl: string;
}

  export function CreateArticleForm({ apiUrl }: CreateArticleFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [published, setPublished] = useState(false);
    const [authorEmail, setAuthorEmail] = useState('admin@example.com');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const slugPreview = title ? slugify(title, { lower: true, strict: true }) : '';

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError(null);
      setSuccess(false);
      setLoading(true);

      try {
        const response = await fetch(`${apiUrl}/articles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            published,
            authorEmail,
          }),
        });

     if (response.ok) {

        setSuccess(true);

        setTitle('');
        setContent('');
        setPublished(false);

        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      } else{
         const data = await response.json();
         throw new Error(data.error || 'Failed to create article. Check if it was created in the database.');
       }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred. The article might have been created - check the dashboard.');
      } finally {
        setLoading(false);
      }
    }

    return (
      <form onSubmit={handleSubmit}>
        {success && (
          <div className="success-message">
            ✅ Article created successfully! Redirecting to dashboard...
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ Error: {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            id="title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter article title..."
          />
          {slugPreview && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              Slug: <code>{slugPreview}</code>
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">
            Content (Markdown) *
          </label>
          <textarea
            id="content"
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your article in Markdown...

  # Heading 1
  ## Heading 2

  **Bold text**
  *Italic text*

  - List item 1
  - List item 2

  ```code block```"
          />
        </div>

        <div className="form-group">
          <label htmlFor="authorEmail" className="form-label">
            Author Email *
          </label>
          <input
            id="authorEmail"
            type="email"
            className="form-input"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              className="form-checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span>Publish immediately</span>
          </label>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            {published ? 'Article will be visible on the blog' : 'Article will be saved as draft'}
          </p>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Article'}
          </button>
          <a href="/admin" className="btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    );
  }
