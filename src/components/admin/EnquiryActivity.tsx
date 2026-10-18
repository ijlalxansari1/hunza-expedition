'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Inbox, RefreshCw, Search, X } from 'lucide-react';
import type { RecentEnquiry } from '@/lib/adminOverviewSummary';

type Filter = 'all' | 'new' | 'inProgress' | 'closed';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All recent' },
  { id: 'new', label: 'New' },
  { id: 'inProgress', label: 'In progress' },
  { id: 'closed', label: 'Closed' },
];

const inProgressStatuses = new Set(['under_review', 'preparing_quotation', 'quotation_sent']);
const closedStatuses = new Set(['confirmed_manual', 'closed', 'not_feasible']);

function formatStatus(status: string) {
  return status.replaceAll('_', ' ');
}

function getStatusStyle(status: string) {
  if (status === 'new') return 'statusNew';
  if (inProgressStatuses.has(status)) return 'statusActive';
  return 'statusClosed';
}

function matchesFilter(enquiry: RecentEnquiry, filter: Filter) {
  if (filter === 'new') return enquiry.status === 'new';
  if (filter === 'inProgress') return inProgressStatuses.has(enquiry.status);
  if (filter === 'closed') return closedStatuses.has(enquiry.status);
  return true;
}

type EnquiryActivityProps = {
  enquiries: RecentEnquiry[];
  total: number;
};

export function EnquiryActivity({ enquiries, total }: EnquiryActivityProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [isRefreshing, startRefresh] = useTransition();

  const visibleEnquiries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesQuery = !normalizedQuery || [
        enquiry.fullName,
        enquiry.email,
        enquiry.referenceId,
        ...enquiry.selectedDestinations,
      ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));

      return matchesQuery && matchesFilter(enquiry, filter);
    });
  }, [enquiries, filter, query]);

  const clearFilters = () => {
    setQuery('');
    setFilter('all');
  };

  return (
    <section className="recentPanel" aria-labelledby="recent-enquiries-title">
      <div className="activityHeader">
        <div className="sectionHeading">
          <span className="sectionEyebrow">Inbox</span>
          <h2 id="recent-enquiries-title">Recent enquiries</h2>
          <p>Search and triage the latest {enquiries.length} of {total} records.</p>
        </div>
        <div className="activityActions">
          <button
            type="button"
            className="refreshButton"
            onClick={() => startRefresh(() => router.refresh())}
            disabled={isRefreshing}
            aria-label={isRefreshing ? 'Refreshing enquiries' : 'Refresh enquiries'}
          >
            <RefreshCw className={isRefreshing ? 'spinning' : undefined} aria-hidden="true" />
            <span>{isRefreshing ? 'Refreshing' : 'Refresh'}</span>
          </button>
          <Link className="viewAllButton" href="/admin/collections/enquiries">
            View all <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="activityToolbar">
        <label className="searchBox">
          <Search aria-hidden="true" />
          <span className="visuallyHidden">Search recent enquiries</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, reference or destination"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
              <X aria-hidden="true" />
            </button>
          )}
        </label>
        <div className="filterTabs" role="group" aria-label="Filter enquiries by status">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? 'filterActive' : 'filterTab'}
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
              <span>{enquiries.filter((enquiry) => matchesFilter(enquiry, item.id)).length}</span>
            </button>
          ))}
        </div>
      </div>

      {visibleEnquiries.length === 0 ? (
        <div className="emptyState" role="status">
          <span className="emptyIcon"><Inbox aria-hidden="true" /></span>
          <strong>{enquiries.length === 0 ? 'Your enquiry inbox is clear' : 'No matching enquiries'}</strong>
          <span>
            {enquiries.length === 0
              ? 'New trip requests will appear here when they arrive.'
              : 'Try another search or clear the status filter.'}
          </span>
          {enquiries.length > 0 && (query || filter !== 'all') && (
            <button type="button" className="clearFilters" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="resultsSummary" role="status" aria-live="polite">
            Showing <strong>{visibleEnquiries.length}</strong> of {enquiries.length} recent enquiries
          </p>
          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Traveller</th>
                  <th scope="col">Reference</th>
                  <th scope="col">Destination</th>
                  <th scope="col">Status</th>
                  <th scope="col">Received</th>
                </tr>
              </thead>
              <tbody>
                {visibleEnquiries.map((enquiry) => (
                  <tr key={enquiry.referenceId}>
                    <td>
                      <p className="enquirerName">{enquiry.fullName}</p>
                      <p className="enquirerEmail">{enquiry.email}</p>
                    </td>
                    <td className="reference">{enquiry.referenceId}</td>
                    <td className="destination">
                      {enquiry.selectedDestinations.length
                        ? enquiry.selectedDestinations.join(', ')
                        : 'Not specified'}
                    </td>
                    <td>
                      <span className={`status ${getStatusStyle(enquiry.status)}`}>
                        <span aria-hidden="true" className="statusDot" />
                        {formatStatus(enquiry.status)}
                      </span>
                    </td>
                    <td className="received">
                      <time dateTime={enquiry.submittedAt}>
                        {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(enquiry.submittedAt))}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
