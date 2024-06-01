import * as React from "react"
import { env } from "@/env.mjs"
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"


interface EmailVerificationEmailProps {
  email: string
  emailVerificationToken: string
}

export  function EmailVerificationEmail({
  email,
  emailVerificationToken,
}: Readonly<EmailVerificationEmailProps>) {

  const previewText = `ITRANSL8 email verification.`
  return (
    <Html lang="en">
      <Head>
        <title>{previewText}</title>
      </Head>
      <Preview>{previewText}</Preview>
        <Body>
          <Container>
            <Section>
              <Text className="text-xl">Hi,</Text>
              <Text className="text-base">
                Your email address, {email}, was recently used to sign up at{" "}
                <span className="font-semibold tracking-wide">
                  ITRANSL8
                </span>
                .
              </Text>
              <Text className="text-base">
                Please verify this address by clicking the button below
              </Text>
              <Button
                href={`${env.NEXT_PUBLIC_APP_URL}/signup/verify-email?token=${emailVerificationToken}`}
              >
                Verify email now
              </Button>
            </Section>

            <Section>
              <Text className="text-xs">
                If you didn&apos;t sign up at ITRANSL8, just ignore and
                delete this message.
              </Text>
              <Text className="text-base font-medium">
                Enjoy{" "}
                <span className="font-semibold tracking-wide">
                  ITRANSL8
                </span>{" "}
                and have a nice day!
              </Text>
            </Section>
          </Container>
        </Body>
    </Html>
  )
}
