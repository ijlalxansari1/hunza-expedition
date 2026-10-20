import Link from 'next/link';
import {
  ArrowUpRight,
  CircleAlert,
  FileText,
  Inbox,
  Layers3,
  Users,
} from 'lucide-react';
import type { AdminViewServerProps } from 'payload';
import { getContentOverview, getEnquiryOverview } from '@/lib/adminOverview';
import { hasAdminRole, hasOperationsRole } from '@/lib/payloadAccess';
import { EnquiryActivity } from './EnquiryActivity';

type MetricProps = {
  label: string;
  value: number | string;
  detail: string;
  icon: typeof FileText;
};

function Metric({ label, value, detail, icon: Icon }: MetricProps) {
  return (
    <section className="metric">
      <div className="metricTop">
        <div className="metricCopy">
          <p className="metricLabel">{label}</p>
          <p className="metricValue">
            {value}
          </p>
        </div>
        <span className="metricIcon">
          <Icon aria-hidden="true" />
        </span>
      </div>
      <p className="metricDetail">{detail}</p>
    </section>
  );
}

export async function Overview({ initPageResult }: AdminViewServerProps) {
  if (!hasOperationsRole(initPageResult.req.user)) {
    return (
      <main className="adminPermissionError" role="alert">
        Only administrators and operations staff can view the operations overview.
      </main>
    );
  }

  const [enquiries, content] = await Promise.all([
    getEnquiryOverview(initPageResult.req),
    getContentOverview(initPageResult.req),
  ]);

  const enquiryValue = enquiries.state === 'available' ? enquiries.total : 'Unavailable';
  const newValue = enquiries.state === 'available' ? enquiries.newCount : 'Unavailable';
  const inProgressValue = enquiries.state === 'available' ? enquiries.inProgressCount : 'Unavailable';
  const publishedValue = content.published.destinations + content.published.places + content.published.tours
    + content.published.experiences + content.published.articles + content.published.faqs;
  const draftsValue = content.draftsAndReview.total;

  return (
    <main className="dashboard">
      <div className="dashboardInner">
        <header className="header">
          <div className="headingGroup">
            <nav aria-label="Breadcrumb" className="breadcrumb">
              <ol>
                <li><Link href="/admin">Admin</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">Overview</li>
              </ol>
            </nav>
            <p className="eyebrow"><span className="eyebrowMark" /> Hunza Expeditions <span>•</span> Admin workspace</p>
            <h1 className="title">Operations overview</h1>
            <p className="lede">
              Real-time operational enquiries, trip workflows, and editorial publishing queues.
            </p>
          </div>
          <div className="actions">
            <Link
              href="/admin/collections/enquiries"
              className="primaryAction"
            >
              <Inbox aria-hidden="true" /> Review enquiries
            </Link>
            <Link
              href="/admin/collections/places"
              className="secondaryAction"
            >
              <Layers3 aria-hidden="true" /> Manage places & tours <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </header>

        <section aria-label="Business metrics" className="metricGrid">
          <Metric
            label="Total enquiries"
            value={enquiryValue}
            detail="All received trip requests"
            icon={FileText}
          />
          <Metric
            label="Needs a response"
            value={newValue}
            detail="New requests awaiting review"
            icon={CircleAlert}
          />
          <Metric
            label="Drafts & in review"
            value={draftsValue}
            detail={`${content.draftsAndReview.places} places · ${content.draftsAndReview.tours} tours · ${content.draftsAndReview.articles} guides`}
            icon={Layers3}
          />
          <Metric
            label="Published content"
            value={publishedValue}
            detail={`${content.published.destinations} regions · ${content.published.places} places · ${content.published.tours} tours · ${content.published.experiences} experiences`}
            icon={Layers3}
          />
        </section>

        <section className="contentGrid">
          {enquiries.state === 'unavailable' ? (
            <section className="recentPanel" aria-labelledby="recent-enquiries-title">
              <div className="sectionHeading">
                <span className="sectionEyebrow">Inbox</span>
                <h2 id="recent-enquiries-title">Recent enquiries</h2>
              </div>
              <div className="emptyState" role="alert">
                <CircleAlert aria-hidden="true" />
                <strong>Enquiry data is unavailable</strong>
                <span>Check the configured enquiry store, then refresh the dashboard.</span>
              </div>
            </section>
          ) : (
            <EnquiryActivity enquiries={enquiries.recent} total={enquiries.total} />
          )}

          <aside className="aside">
            <section className="asideSection">
              <span className="sectionEyebrow">System status</span>
              <h2 className="asideTitle">Operations health</h2>
              <dl className="dataList">
                <div>
                  <dt><span className="sourceDot" /> Database</dt>
                  <dd>PostgreSQL · Live</dd>
                </div>
                <div>
                  <dt><span className="sourceDot" /> Enquiries store</dt>
                  <dd>Payload · Live</dd>
                </div>
                <div>
                  <dt><span className="sourceDot" /> Outbox pipeline</dt>
                  <dd>Active</dd>
                </div>
              </dl>
              <p className="asideNote">
                All records, relationships, and customer data are hosted within verified PostgreSQL storage.
              </p>
            </section>

            <section className="asideSection">
              <span className="sectionEyebrow">Navigation</span>
              <h2 className="asideTitle">Quick actions</h2>
              <ul className="quickLinks">
                <li>
                  <Link href="/admin/collections/enquiries">
                    Review trip enquiries <ArrowUpRight aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/admin/collections/places">
                    Places & attractions <ArrowUpRight aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/admin/collections/tours">
                    Tours & expeditions <ArrowUpRight aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/admin/collections/place-categories">
                    Place categories <ArrowUpRight aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/admin/collections/official-designations">
                    Official designations <ArrowUpRight aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/admin/collections/experiences">
                    Community experiences <ArrowUpRight aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/admin/collections/articles">
                    Guides & blog posts <ArrowUpRight aria-hidden="true" />
                  </Link>
                </li>
                {hasAdminRole(initPageResult.req.user) && (
                  <li>
                    <Link href="/admin/collections/users">
                      Team & staff accounts <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </li>
                )}
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}