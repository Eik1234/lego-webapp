import styles from './bdb.css';
import React, { Component } from 'react';
import BdbRightNav from './BdbRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput, RadioButton } from 'app/components/Form';
import SemesterStatusContent from './SemesterStatusContent';
import {
  getContactedStatuses,
  selectMostProminentStatus,
  selectColorCode
} from '../utils';

type Props = {
  addSemesterStatus: () => void,
  handleSubmit: () => void,
  companyId: string,
  submitting: boolean,
  autoFocus: any,
  companySemesters: Array<Object>,
  addSemester: () => void
};

export default class AddSemester extends Component {
  props: Props;

  state = {
    contactedStatus: [],
    submit: false
  };

  onSubmit = ({ year, semester, contract }) => {
    if (!this.state.submit) return;
    const {
      companyId,
      addSemesterStatus,
      companySemesters,
      addSemester
    } = this.props;
    const { contactedStatus } = this.state;

    const globalSemester = companySemesters.find(
      companySemester =>
        companySemester.year === year && companySemester.semester === semester
    );

    if (globalSemester) {
      addSemesterStatus(
        {
          companyId,
          semester: globalSemester.id,
          contactedStatus,
          contract
        },
        true
      );
    } else {
      addSemester(year, semester).then(response => {
        const newlyCreatedId = this.props.companySemesters.find(
          companySemester =>
            companySemester.year === status.semester.year &&
            companySemester.semester === status.semester.semester
        ).id;
        addSemesterStatus(
          {
            companyId,
            semester: newlyCreatedId,
            contactedStatus,
            contract
          },
          true
        );
      });
    }
  };

  setContactedStatus = event => {
    this.setState({ contactedStatus: event.target.value });
  };

  editFunction = statusString => {
    console.log('woop');
    this.setState({
      contactedStatus: getContactedStatuses(
        this.state.contactedStatus,
        statusString
      )
    });
  };

  render() {
    const { companyId, submitting, autoFocus, handleSubmit } = this.props;

    const semesterStatus = { contactedStatus: this.state.contactedStatus };

    return (
      <div className={styles.root}>
        <h1>Legg til semester</h1>

        <div className={styles.detail}>
          <div className={styles.leftSection}>
            <i style={{ display: 'block', marginBottom: '10px' }}>
              <b>Hint:</b> du kan legge til status for flere semestere samtidig
              på Bdb-forsiden!
            </i>

            <form onSubmit={handleSubmit(this.onSubmit)}>
              <h3>År</h3>
              <Field
                autoFocus={autoFocus}
                placeholder="År"
                label={' '}
                name="year"
                type="number"
                component={TextInput.Field}
                className={styles.yearForm}
              />

              <div className={styles.choices}>
                <h3>Semester</h3>
                <div className={styles.editInfo}>
                  <label>
                    <Field
                      name="semester"
                      component={RadioButton.Field}
                      fieldStyle={{ width: '24px', marginBottom: 0 }}
                      inputValue={'spring'}
                    />{' '}
                    Vår
                  </label>
                </div>
                <div className={styles.editInfo}>
                  <label>
                    <Field
                      name="semester"
                      component={RadioButton.Field}
                      fieldStyle={{ width: '24px', marginBottom: 0 }}
                      inputValue={'autumn'}
                    />{' '}
                    Høst
                  </label>
                </div>
              </div>

              <h3>Status</h3>
              <div
                style={{
                  width: '200px',
                  minHeight: '30px',
                  margin: '15px 0 25px',
                  borderRadius: '5px',
                  border: '1px solid #ccc'
                }}
                type="button"
                className={
                  styles[
                    selectColorCode(
                      selectMostProminentStatus(semesterStatus.contactedStatus)
                    )
                  ]
                }
              >
                <SemesterStatusContent
                  semesterStatus={semesterStatus}
                  submit={false}
                  editFunction={statusCode => this.editFunction(statusCode)}
                  style={{
                    minHeight: '30px',
                    padding: '10px'
                  }}
                />
              </div>

              <h3>Kontrakt</h3>
              <Field
                placeholder={'Kontrakt for dette semesteret'}
                label={' '}
                autoFocus={autoFocus}
                name="contract"
                component={TextInput.Field}
                className={styles.contractForm}
              />

              <div className={styles.clear} />

              <Button
                className={styles.submit}
                disabled={submitting}
                onClick={() => this.setState({ submit: true })}
                submit
                style={{ marginBottom: '0!important' }}
              >
                Lagre
              </Button>
            </form>
          </div>

          <BdbRightNav {...this.props} companyId={companyId} />
        </div>
      </div>
    );
  }
}
