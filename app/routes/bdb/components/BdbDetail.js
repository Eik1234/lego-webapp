import React, { Component } from 'react';
import styles from './bdb.css';
import { sortByYearThenSemester, getContactedStatuses } from '../utils.js';
import BdbRightNav from './BdbRightNav';
import InfoBubble from 'app/components/InfoBubble';
import CommentView from 'app/components/Comments/CommentView';
import Time from 'app/components/Time';
import { Link } from 'react-router';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Image from 'app/components/Image';
import SemesterStatusDetail from './SemesterStatusDetail';
import Button from 'app/components/Button';

type Props = {
  company: Object,
  comments?: Array<Object>,
  companyEvents: Array<Object>,
  currentUser: any,
  deleteSemesterStatus: () => void,
  deleteCompanyContact: () => void,
  loggedIn: boolean,
  companySemesters: Array<Object>,
  editSemesterStatus: () => void
};

export default class BdbDetail extends Component {
  props: Props;

  state = {
    addingFiles: false,
    changedSemesters: [],
    changedFiles: []
  };

  semesterStatusOnChange = (semesterStatus, statusString) => {
    console.log('semesterStatusOnChange');
    console.log(semesterStatus);
    console.log(statusString);

    const { changedSemesters } = this.state;

    const newSemesterStatus = {
      ...semesterStatus,
      contactedStatus: getContactedStatuses(
        semesterStatus.contactedStatus,
        statusString
      )
    };
    const oldSemester = changedSemesters.find(
      status => status.id === semesterStatus.id
    );

    if (oldSemester) {
      const newSemesters = changedSemesters.map(
        status => (status.id === semesterStatus.id ? newSemesterStatus : status)
      );
      this.setState({ semesterStatuses: newSemesters });
    } else {
      this.setState(state => ({
        changedSemesters: state.changedSemesters.concat(newSemesterStatus)
      }));
    }
  };

  submitSemesters = () => {
    const { companySemesters, editSemesterStatus, company } = this.props;

    const { changedSemesters } = this.state;

    changedSemesters.map(semesterStatus => {
      const globalSemester = companySemesters.find(
        companySemester =>
          companySemester.year === semesterStatus.year &&
          companySemester.semester === semesterStatus.semester
      );
      const sendableSemester = {
        contactedStatus: semesterStatus.contactedStatus,
        contract: semesterStatus.contract,
        semesterStatusId: semesterStatus.id,
        semester: globalSemester.id,
        companyId: company.id
      };

      editSemesterStatus(sendableSemester, true);

      this.setState({ changedSemesters: [] });
    });
  };

  deleteSemesterStatus = semesterId => {
    const { deleteSemesterStatus, company } = this.props;
    deleteSemesterStatus(company.id, semesterId);
  };

  deleteCompanyContact = companyContactId => {
    const { deleteCompanyContact, company } = this.props;
    deleteCompanyContact(company.id, companyContactId);
  };

  render() {
    console.log('rendering...');
    console.log(this.state.changedSemesters);
    const {
      company,
      comments,
      companyEvents,
      currentUser,
      loggedIn
    } = this.props;

    if (!company.semesterStatuses) {
      return <LoadingIndicator loading />;
    }

    const mergedSemesters = company.semesterStatuses.map(
      status =>
        this.state.changedSemesters.find(changed => changed.id === status.id) ||
        status
    );

    const semesters = (mergedSemesters || [])
      .sort(sortByYearThenSemester)
      .map((status, i) => (
        <SemesterStatusDetail
          status={status}
          key={i}
          companyId={company.id}
          deleteSemesterStatus={this.deleteSemesterStatus}
          editFunction={this.semesterStatusOnChange}
        />
      ));

    let companyContacts = [];
    if (company.companyContacts) {
      companyContacts = company.companyContacts.map((contact, i) => (
        <tr key={i}>
          <td>{contact.name || '-'}</td>
          <td>{contact.role || '-'}</td>
          <td>{contact.mail || '-'}</td>
          <td style={{ display: 'flex', justifyContent: 'space-between' }}>
            {contact.phone || '-'}
            <span style={{ display: 'flex', flexDirection: 'row' }}>
              <Link to={`/bdb/${company.id}/company-contacts/${contact.id}`}>
                <i
                  className="fa fa-pencil"
                  style={{ marginRight: '5px', color: 'orange' }}
                />
              </Link>
              <a onClick={() => this.deleteCompanyContact(contact.id)}>
                <i className="fa fa-times" style={{ color: '#d13c32' }} />
              </a>
            </span>
          </td>
        </tr>
      ));
    }

    const events = companyEvents
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .map((event, i) => (
        <tr key={i}>
          <td>{event.title}</td>
          <td>{event.eventType}</td>
          <td>
            <Time time={event.startTime} format="DD.MM.YYYY" />
          </td>
        </tr>
      ));

    return (
      <div className={styles.root}>
        <div className={styles.detail}>
          <div className={styles.leftSection}>
            {company.logo && (
              <Image
                src={company.logo}
                style={{ height: 'inherit', border: '1px solid #ccc' }}
              />
            )}
            <h1>
              {company.name} {!company.active && 'Inaktiv'}
            </h1>
            <div className={styles.description}>
              {company.description || 'Ingen beskrivelse tilgjengelig.'}
            </div>

            <div className={styles.infoBubbles}>
              <InfoBubble
                icon={'briefcase'}
                data={company.companyType}
                meta={'Type bedrift'}
                style={{ order: 0 }}
              />
              <InfoBubble
                icon={'mail'}
                data={company.paymentMail}
                meta={'Fakturamail'}
                style={{ order: 1 }}
              />
              <InfoBubble
                icon={'call'}
                data={company.phone}
                meta={'Telefon'}
                style={{ order: 2 }}
              />
            </div>

            <div className={styles.infoBubbles}>
              <InfoBubble
                icon={'at'}
                data={company.website}
                meta={'Nettside'}
                style={{ order: 0 }}
              />
              <InfoBubble
                icon={'home'}
                data={company.address}
                meta={'Adresse'}
                style={{ order: 1 }}
              />
              <InfoBubble
                icon={'person'}
                data={`${company.studentContact
                  ? company.studentContact.firstName
                  : ''} ${company.studentContact
                  ? company.studentContact.lastName
                  : ''}`}
                meta={'Studentkontakt'}
                style={{ order: 2 }}
              />
            </div>

            <h3>Bedriftskontakter</h3>
            {companyContacts.length > 0 ? (
              <div
                className={styles.companyList}
                style={{ marginBottom: '10px' }}
              >
                <table className={styles.contactTable}>
                  <thead className={styles.categoryHeader}>
                    <tr>
                      <th>Navn</th>
                      <th>Rolle</th>
                      <th>E-post</th>
                      <th>Tlf</th>
                    </tr>
                  </thead>
                  <tbody>{companyContacts}</tbody>
                </table>
              </div>
            ) : (
              <i style={{ display: 'block' }}>
                Ingen bedriftskontakter registrert.
              </i>
            )}

            <Link
              to={`/bdb/${company.id}/company-contacts/add`}
              style={{ marginTop: '10px' }}
            >
              <i className="fa fa-plus-circle" /> Legg til bedriftskontakt
            </Link>

            <div style={{ clear: 'both', marginBottom: '30px' }} />

            <h3>Semesterstatuser</h3>
            {semesters.length > 0 ? (
              <div
                className={styles.companyList}
                style={{ marginBottom: '10px' }}
              >
                <table className={styles.detailTable}>
                  <thead className={styles.categoryHeader}>
                    <tr>
                      <th>Semester</th>
                      <th>Status</th>
                      <th>Kontrakt</th>
                    </tr>
                  </thead>
                  <tbody>{semesters}</tbody>
                </table>
              </div>
            ) : (
              <i style={{ display: 'block' }}>Ingen sememsterstatuser.</i>
            )}

            {this.state.changedSemesters &&
              this.state.changedSemesters.length > 0 && (
                <Button dark onClick={this.submitSemesters}>
                  Lagre semestere
                </Button>
              )}

            <div>
              <Link to={`/bdb/${company.id}/semesters/add`}>
                <i className="fa fa-plus-circle" /> Legg til nytt semester
              </Link>
            </div>

            <div className={styles.files}>
              <h3>Filer</h3>
              <ul>
                {!this.state.files || this.state.files.length === 0 ? (
                  <i>Ingen filer.</i>
                ) : (
                  this.state.files.map((file, i) => <li key={i}>{file}</li>)
                )}
              </ul>
              <Link to={`/bdb/${company.id}/semesters/add`}>
                <i className="fa fa-plus-circle" /> Legg til fil
              </Link>
            </div>

            <div className={styles.adminNote}>
              <h3>Notat fra Bedkom</h3>
              {company.adminComment || <i>Ingen notater</i>}
            </div>

            <h3>Bedriftens arrangementer</h3>
            {events.length > 0 ? (
              <div className={styles.companyList}>
                <table className={styles.eventsTable}>
                  <thead className={styles.categoryHeader}>
                    <tr>
                      <th>Tittel</th>
                      <th>Arrangementstype</th>
                      <th>Når</th>
                    </tr>
                  </thead>
                  <tbody>{events}</tbody>
                </table>
              </div>
            ) : (
              <i>Ingen arrangementer.</i>
            )}

            <div style={{ clear: 'both', marginBottom: '30px' }} />

            <CommentView
              user={currentUser}
              commentTarget={company.commentTarget}
              loggedIn={loggedIn}
              comments={comments}
            />
          </div>

          <BdbRightNav {...this.props} />
        </div>
      </div>
    );
  }
}
