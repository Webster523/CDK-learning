#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { TsOthersStack } from '../lib/ts-others-stack';

const app = new cdk.App();
new TsOthersStack(app, 'TsOthersStack');
