import { ProfileConnectionsPage } from "@/components/profile/ProfileConnectionsPage";

type Props = { params: { username: string } };

export default function ProfileFollowingPage({ params }: Props) {
  return <ProfileConnectionsPage usernameParam={params.username} kind="following" />;
}
