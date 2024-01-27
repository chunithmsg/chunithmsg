import { SNOWFLAKE_EPOCH } from './constants';

export const getSnowflake = async () => {
  const { Snowflake } = await import('nodejs-snowflake');

  return new Snowflake({
    custom_epoch: SNOWFLAKE_EPOCH,
  });
};
