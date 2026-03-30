import { ProfileConnectionsPage } from "@/components/profile/ProfileConnectionsPage";

type Props = { params: { username: string } };

export default function ProfileFollowersPage({ params }: Props) {
  return <ProfileConnectionsPage usernameParam={params.username} kind="followers" />;
}
