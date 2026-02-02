import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Download,
  Heart,
  Share2,
  Calendar,
  FolderOpen,
  Video,
  FileText,
  Mail,
  User,
  Clock,
  Eye,
} from 'lucide-react';
import { resourceService } from '../services/dataService';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import SEO from '../components/seo/SEO';
import UserAvatar from '../components/common/UserAvatar';

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const response = await resourceService.getById(id);
      if (response.data.success) {
        setResource(response.data.data);
        setLikeCount(response.data.data.likes || 0);
      }
    } catch (error) {
      toast.error('Failed to fetch resource details');
      navigate('/resources');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
    toast.success(liked ? 'Like removed' : 'Resource liked!');
  };

  const handleDownload = () => {
    if (resource?.link) {
      window.open(resource.link, '_blank');
      toast.success('Opening resource...');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: resource?.title,
      text: `Check out this resource: ${resource?.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getCategoryIcon = () => {
    if (resource?.isVideo) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Software Notes': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Interview Notes': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Tools & Technology': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Trending Technology': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Video Resources': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Software Project': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'Hardware Project': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  if (loading) {
    return <Loader />;
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Resource Not Found
          </h2>
          <button
            onClick={() => navigate('/resources')}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${resource.title} - Free Resource | EduLearnix`}
        description={resource.description || `Download ${resource.title} - ${resource.category}`}
        keywords={`${resource.title}, ${resource.category}, ${resource.subcategory}, free resources, download, edulearnix`}
        ogType="article"
        canonicalUrl={`https://edulearnix.in/resources/${id}`}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Resources</span>
          </button>

          {/* Main Content Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Thumbnail Section */}
            {resource.thumbnail && (
              <div className="relative h-64 sm:h-80 bg-gradient-to-br from-blue-500 to-purple-600">
                <img
                  src={resource.thumbnail}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=Resource';
                  }}
                />
                {resource.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-4">
                      <Video className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="p-6 sm:p-8 lg:p-10">
              {/* Category Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                    resource.category
                  )}`}
                >
                  {getCategoryIcon()}
                  {resource.category}
                </span>
                {resource.subcategory && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {resource.subcategory}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {resource.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(resource.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>{resource.downloads || 0} downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{likeCount} likes</span>
                </div>
              </div>

              {/* Description */}
              {resource.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    About this Resource
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {resource.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={handleDownload}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Access Resource</span>
                </button>
                <button
                  onClick={handleLike}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 border-2 ${
                    liked
                      ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } font-medium rounded-lg transition-colors`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{liked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Posted By Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Posted By
                </h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <UserAvatar
                    user={resource.postedBy}
                    size="lg"
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {resource.postedBy?.name || 'Anonymous'}
                      </h4>
                      {resource.postedBy?.role === 'super_admin' && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <a
                        href={`mailto:${resource.postedBy?.email}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 truncate"
                      >
                        {resource.postedBy?.email || 'No email'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Resources Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              More from {resource.category}
            </h2>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Link
                to="/resources"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Browse all resources →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceDetails;
