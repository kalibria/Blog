import { useState, useEffect } from 'react';
  import slugify from 'slugify';
  import type { Article } from '../../types/article';

  interface EditArticleFormProps {
    apiUrl: string;
    articleId: string;
  }

  export function EditArticleForm({ apiUrl, articleId }: EditArticleFormProps) {

    console.log('API URL:', apiUrl);
    console.log('Article ID:', articleId);
    console.log('Full fetch URL:', `${apiUrl}/articles/${articleId}`);

    const [article, setArticle] = useState<Article | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [published, setPublished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const slugPreview = title ? slugify(title, { lower: true, strict: true }) : '';

    useEffect(() => {
      fetchArticle();
    }, [articleId]);

    async function fetchArticle() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${apiUrl}/articles/${articleId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }

        const data = await response.json();
        const fetchedArticle = data.article;

        setArticle(fetchedArticle);
        setTitle(fetchedArticle.title);
        setContent(fetchedArticle.content);
        setPublished(fetchedArticle.published);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError(null);
      setSuccess(false);
      setSaving(true);

      try {
        const response = await fetch(`${apiUrl}/articles/${articleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            published
          }),
        });

        if (response.ok) {
          setSuccess(true);

          setTimeout(() => {
            window.location.href = '/admin';
          }, 2000);
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update article');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setSaving(false);
      }
    }

    if (loading) {
      return (
        <div className="loading-message">
          ⏳ Loading article...
        </div>
      );
    }

    if (error && !article) {
      return (
        <div className="error-message">
          ❌ Error: {error}
          <br />
          <a href="/admin" style={{ marginTop: '1rem', display: 'inline-block' }}>
            ← Back to Dashboard
          </a>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit}>
        {success && (
          <div className="success-message">
            ✅ Article updated successfully! Redirecting to dashboard...
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
              {article && slugPreview !== article.slug && (
                <span style={{ color: '#dc3545', marginLeft: '0.5rem' }}>
                  (Warning: Changing the slug will break existing links)
                </span>
              )}
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
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              className="form-checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span>Published</span>
          </label>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            {published ? 'Article is visible on the blog' : 'Article is saved as draft'}
          </p>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Updating...' : 'Update Article'}
          </button>
          <a href="/admin" className="btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    );
  }