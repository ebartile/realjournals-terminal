import React, { useContext, useEffect } from 'react';
import { fetchUser } from 'redux/slices/auth';
import { useDispatch } from 'react-redux';
import { useAuth } from 'models/Auth';
import { route, useRequest } from 'services/Http';
import { notify } from 'utils/index';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import Result from 'components/Result';
import { LoadingButton } from '@material-ui/lab';
import MailUnverified from './mail_unverified';
import MailVerified from './mail_verified';
import StepContext from 'contexts/StepContext';

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const [request, loading] = useRequest();
  const { next } = useContext(StepContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!auth.user.hasVerifiedEmail()) {
        dispatch(fetchUser());
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, auth]);

  const resendEmail = () => {
    request
      .post(route('users.email-verification.send'))
      .then(() => {
        notify.success('Email was resent.');
      })
      .catch((error) => {
        if (error.response.data._error_message) {
          notify.error(error.response.data._error_message);
        }
      });
  };

  return (
    <Card>
      <CardHeader title="Email Verification" />

      <CardContent>
        {auth.user.hasVerifiedEmail() ? (
          <Result
            title="Email Verified!"
            description="Your email has been verified."
            icon={MailVerified}
            extra={
              <LoadingButton variant="contained" onClick={() => next()} loading={loading}>
                Next
              </LoadingButton>
            }
          />
        ) : (
          <Result
            title="Check your email."
            description="We sent you a verification link."
            icon={MailUnverified}
            iconProps={{
              className: 'animated infinite pulse'
            }}
            extra={
              <LoadingButton variant="outlined" onClick={resendEmail} loading={loading}>
                Resend Email
              </LoadingButton>
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyEmail;
