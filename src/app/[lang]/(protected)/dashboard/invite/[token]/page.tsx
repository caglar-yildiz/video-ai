import InvitationDialog from "@/components/app/protected/diologs/invitation-dialog"
import { prisma } from "@/db"
import { Lang } from "@/i18n-config"


type  TokenPageProps =  {
  params: {
    token: string;
    lang: Lang;
  }
};


const InvitePage = async ({ params: { token, lang } }: TokenPageProps) => {

  const invitation = await prisma.invite.findUnique({
    where: {
      token,
    },
    include: {
      organization: true,
    }
  });

  const admin = await prisma.user.findFirst({
    where : {
      organizationId : invitation?.organizationId,
      role : "ADMIN"
    }
  });

  const adminName = admin?.name
  const organizationName = invitation?.organization.name;
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      {adminName && organizationName ? (
        <InvitationDialog adminName={adminName}
                          organizationName={organizationName}
                          token={token}
                          lang={lang}
        />
      ) : (
        <div>Invalid Token</div>
      )}
    </div>
  );
};

export default InvitePage;
