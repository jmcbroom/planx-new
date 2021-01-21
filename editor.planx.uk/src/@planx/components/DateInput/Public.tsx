import type { DateInput, UserData } from "@planx/components/DateInput/model";
import { dateSchema } from "@planx/components/DateInput/model";
import Card from "@planx/components/shared/Preview/Card";
import QuestionHeader from "@planx/components/shared/Preview/QuestionHeader";
import { PublicProps } from "@planx/components/ui";
import { useFormik } from "formik";
import React from "react";
import DateInputComponent from "ui/DateInput";
import InputRow from "ui/InputRow";
import { object } from "yup";

export type Props = PublicProps<DateInput, UserData>;

const DateInputPublic: React.FC<Props> = (props) => {
  const formik = useFormik({
    initialValues: {
      date: "",
    },
    onSubmit: (values) => {
      props.handleSubmit && props.handleSubmit(values.date);
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: object({
      date: dateSchema({ min: props.min, max: props.max }),
    }),
  });

  return (
    <Card handleSubmit={formik.handleSubmit}>
      <QuestionHeader
        title={props.title}
        description={props.description}
        info={props.info}
        policyRef={props.policyRef}
        howMeasured={props.howMeasured}
      />
      <InputRow>
        <DateInputComponent
          value={formik.values.date}
          bordered
          onChange={(newDate: string) => {
            formik.setFieldValue("date", newDate);
          }}
          error={formik.errors.date}
        />
      </InputRow>
    </Card>
  );
};

export default DateInputPublic;
