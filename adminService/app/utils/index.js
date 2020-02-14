'use strict';
import {
  AuthenticationError,
  AuthorizationError,
  errorMessage,
} from 'iyasunday';
import { createHash } from 'crypto';

export async function sendMail({ to, subject, message }) {
  try {
    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.MAILER_DISPLAY_EMAIL}>`,
      to,
      subject,
      html: message,
    });
  } catch (err) {
    throw err;
  }
}

export function routeGuard(allowPublicAccess = false) {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token)
        throw new AuthenticationError(
          'Kindly supply your access token to continue'
        );
      else if (
        token !== process.env.ADMIN_API_SECRET &&
        token !== process.env.PUBLIC_API_SECRET
      )
        throw new AuthenticationError('Supplied access token not correct');
      else if (!allowPublicAccess && token !== process.env.ADMIN_API_SECRET)
        throw new AuthorizationError('Access denied');
      return next();
    } catch (err) {
      res.status(err.httpStatusCode || 500).json(errorMessage(err));
    }
  };
}

export function md5(plainText = Date.now().toString()) {
  return createHash('md5')
    .update(plainText)
    .digest('hex');
}
