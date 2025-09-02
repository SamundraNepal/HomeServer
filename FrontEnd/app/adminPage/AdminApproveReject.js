import { apiLink } from '@/API/API CALLS';

export async function AdminApprove(email) {
  try {
    const response = await fetch(
      `${apiLink}/users/admin/approval/${email}`
    );

    if (!response.ok) {
      throw new Error('Something went wrong');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to approve the account');
  }
}
