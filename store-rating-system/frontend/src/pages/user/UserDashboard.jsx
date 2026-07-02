import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { userService } from '../../services/userService';
import SearchBar from '../../components/SearchBar.jsx';
import Pagination from '../../components/Pagination.jsx';
import Loader from '../../components/Loader.jsx';
import { EmptyState, ErrorState } from '../../components/EmptyState.jsx';
import RatingStars from '../../components/RatingStars.jsx';
import Modal from '../../components/Modal.jsx';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [modalStore, setModalStore] = useState(null);
  const [pendingRating, setPendingRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = useCallback(() => {
    setLoading(true);
    userService
      .listStores({ search, page, limit: 9 })
      .then((res) => {
        setStores(res.data);
        setPagination(res.pagination);
      })
      .catch(() => setError('Failed to load stores'))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const openRatingModal = (store) => {
    setModalStore(store);
    setPendingRating(store.userSubmittedRating || 0);
  };

  const handleSubmitRating = async () => {
    if (!pendingRating) {
      toast.error('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      if (modalStore.userSubmittedRating && modalStore.ratingId) {
        await userService.updateRating(modalStore.ratingId, { rating: pendingRating });
      } else {
        await userService.submitRating({ storeId: modalStore.id, rating: pendingRating });
      }
      toast.success('Rating saved successfully!');
      setModalStore(null);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Browse Stores</h1>

      <div className="mb-6">
        <SearchBar onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="Search by store name or address..." />
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} />
      ) : stores.length === 0 ? (
        <EmptyState message="No stores found." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => (
            <div key={store.id} className="card flex flex-col gap-3">
              <div>
                <h3 className="font-semibold text-lg">{store.name}</h3>
                <p className="text-sm text-gray-500">{store.address || 'No address provided'}</p>
              </div>

              <div className="flex items-center gap-2">
                <RatingStars value={Math.round(store.overallRating || 0)} readOnly size="text-base" />
                <span className="text-xs text-gray-400">Overall: {store.overallRating || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-2">
                {store.userSubmittedRating ? (
                  <>
                    <RatingStars value={store.userSubmittedRating} readOnly size="text-base" />
                    <span className="text-xs text-gray-400">Your rating</span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">You haven't rated this store yet</span>
                )}
              </div>

              <button className="btn-primary mt-auto" onClick={() => openRatingModal(store)}>
                {store.userSubmittedRating ? 'Edit Rating' : 'Submit Rating'}
              </button>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      <Modal
        open={!!modalStore}
        onClose={() => setModalStore(null)}
        title={modalStore ? `Rate ${modalStore.name}` : ''}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalStore(null)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSubmitRating} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Rating'}
            </button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-gray-500">Select your rating (1-5 stars)</p>
          <RatingStars value={pendingRating} onChange={setPendingRating} size="text-3xl" />
        </div>
      </Modal>
    </div>
  );
};

export default UserDashboard;
