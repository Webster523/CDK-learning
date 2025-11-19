#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { TsOthersStack } from '../lib/ts-others-stack';
import {PolicyChecker} from "../lib/PolicyChecker";

const app = new cdk.App();
const otherStack = new TsOthersStack(app, 'TsOthersStack');
cdk.Tags.of(otherStack).add('stage', 'test'); // add a tag to a construct and its sub-constructs
cdk.Tags.of(otherStack).add('storage', 'main', {
    includeResourceTypes: ['AWS::S3::Bucket'],
}); // add a tag to a specific construct

cdk.Aspects.of(app).add(new PolicyChecker());