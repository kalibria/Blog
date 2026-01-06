  import { useState, useEffect } from 'react';
  import { format } from 'date-fns';
  import type { Article } from '../../types/article';

  interface ArticlesListProps {
    apiUrl: string;
  }

  export function ArticlesList({ apiUrl }: ArticlesListProps) {

    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

    useEffect(() => {
      fetchArticles();
    }, []);

    async function fetchArticles() {
      try {
        setLoading(true);

        const response = await fetch(`${apiUrl}/articles?all=true`);

        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    async function handleDelete(id: string, title: string) {
      if (!confirm(`Are you sure you want to delete "${title}"?`)) {
        return;
      }

      try {
        setDeletingId(id);
        setDeleteSuccess(null);

        const response = await fetch(`${apiUrl}/articles/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete article');
        }

        setDeleteSuccess(`"${title}" has been deleted successfully!`);

        setTimeout(() => {
          setDeleteSuccess(null);
        }, 3000);

        fetchArticles();
      } catch (err) {
        alert('Error deleting article: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setDeletingId(null);
      }
    }

    if (loading) {
      return <p>Loading articles...</p>;
    }

    if (error) {
      return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    if (articles.length === 0) {
      return <p>No articles yet. Create your first one!</p>;
    }

    return (
      <>
        {deleteSuccess && (
          <div style={{
            color: '#28a745',
            background: '#d4edda',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            ✅ {deleteSuccess}
          </div>
        )}

        <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td>
                <a href={`/articles/${article.slug}`} target="_blank">
                  {article.title}
                </a>
              </td>
              <td>
                <span className={`status-badge ${article.published ? 'status-published' : 'status-draft'}`}>
                  {article.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td>{format(new Date(article.createdAt), 'MMM d, yyyy')}</td>
              <td>
                <div className="actions">
                  <a href={`/admin/edit/${article.id}`} className="btn">
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(article.id, article.title)}
                    className="btn btn-danger"
                    disabled={deletingId === article.id}
                  >
                    {deletingId === article.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
    );
  }