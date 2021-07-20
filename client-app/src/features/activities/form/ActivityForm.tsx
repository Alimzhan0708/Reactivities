import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import LoadingComponent from "../../../app/layout/LoadingComponent";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import { categoryOptions } from "../../../app/common/options/category.options";
import DateInput from "../../../app/common/form/DateInput";
import { ActivityFormValues } from "../../../app/models/activity";
import { v4 as uuid } from 'uuid';

const ActivityForm = () => {
    const history = useHistory();
    const { activityStore } = useStore();
    const { loadingInitial, loadActivity, createActivity, editActivity } = activityStore;
    const { id } = useParams<{ id: string }>()

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description title is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required(),
    });

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    }, [id, loadActivity]);

    function handleFormSubmit(activity: ActivityFormValues) {
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => {
                history.push(`/activities/${newActivity.id}`);
            });
        } else {
            editActivity(activity).then(() => {
                history.push(`/activities/${activity.id}`);
            })
        };
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            <Formik validationSchema={validationSchema} enableReinitialize initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
                {({ isValid, isSubmitting, dirty, handleSubmit }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <TextInput placeholder='title' name='title' />
                        <TextArea rows={3} placeholder='Description' name='description' />
                        <SelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <DateInput
                            placeholderText='Date'
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal' />
                        <TextInput placeholder='City' name='city' />
                        <TextInput placeholder='Venue' name='venue' />
                        <Button disabled={isSubmitting || !dirty || !isValid} loading={isSubmitting} floated='right' positive type='submit' content='Submit' />
                        <Button floated='right' type='Button' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
}

export default observer(ActivityForm);