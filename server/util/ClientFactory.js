import {config} from '../config';
import {aws} from 'aws-sdk';

/**
 * A client factory for getting aws clients.
 */
export class ClientFactory {
  /**
   * Get a DynamoDB DocumentClient for the current region.
   */
  getDdbClient() {
    aws.config.update({
      region: config.aws.region,
      endpoint: config.aws.ddbEndpoint
    });

    return new aws.DynamoDB.DocumentClient();
  }
}
