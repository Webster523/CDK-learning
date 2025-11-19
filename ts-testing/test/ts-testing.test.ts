import * as cdk from 'aws-cdk-lib/core';
import {Template, Match, Capture} from 'aws-cdk-lib/assertions';
import {TsSimpleStack} from "../lib/ts-simple-stack";

describe('TsSimpleStack', () => {
    let template: Template;
    beforeAll(() => {
        const app = new cdk.App({
            outdir: 'cdk.out/test'
        });
        const stack = new TsSimpleStack(app, 'MyTestStack');
        template = Template.fromStack(stack);
    })

    test('Lambda runtime check', () => {
        template.hasResourceProperties('AWS::Lambda::Function', {
            Runtime: "nodejs18.x",
        });
        template.hasResourceProperties('AWS::Lambda::Function', {
            Runtime: Match.stringLikeRegexp("nodejs")
        });
        template.resourceCountIs("AWS::Lambda::Function", 1);
    });

    test('Lambda bucket policy with Matcher', () => {
        template.hasResourceProperties('AWS::IAM::Policy',
            Match.objectLike({
                PolicyDocument: {
                    Statement: [{
                        Resource: [{
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('SimpleBucket'), 'Arn'
                            ]
                        }, Match.anyValue()]
                    }]
                }
            })
        );
    })

    test('Lambda action with capture', () => {
        const lambdaActionCapture = new Capture();
        template.hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [{
                    Action: lambdaActionCapture
                }]
            }
        });

        const expectedArray = [
            "s3:GetObject*",
            "s3:GetBucket*",
            "s3:List*"
        ];
        expect(lambdaActionCapture.asArray()).toEqual(
            expect.arrayContaining(expectedArray)
        );
    });

    test('Bucket properties with snapshot', () => {
        const bucketTemplate = template.findResources("AWS::S3::Bucket");

        expect(bucketTemplate).toMatchSnapshot();
    })
})


