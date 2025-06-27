import logger from "../utils/logger.js";
import { groupQueue, messageQueue } from "../utils/queue.js";

class GroupService {
    constructor(client, welcomeManager) {
        this.client = client;
        this.welcomeManager = welcomeManager;
    }

    /**
     * Get group metadata
     */
    async getGroupMetadata(groupId) {
        return groupQueue.add(async () => {
            try {
                return await this.client.groupMetadata(groupId);
            } catch (error) {
                logger.error(`Failed to get group metadata for ${groupId}`, error);
                return null;
            }
        });
    }

    /**
     * Get group admins
     */
    getGroupAdmins(participants) {
        return participants
            .filter(participant => participant.admin !== null)
            .map(admin => admin.id);
    }

    /**
     * Check if user is group admin
     */
    async isGroupAdmin(groupId, userId) {
        try {
            const metadata = await this.getGroupMetadata(groupId);
            if (!metadata) return false;
            
            const admins = this.getGroupAdmins(metadata.participants);
            return admins.includes(userId);
        } catch (error) {
            logger.error(`Failed to check admin status for ${userId} in ${groupId}`, error);
            return false;
        }
    }

    /**
     * Check if bot is group admin
     */
    async isBotGroupAdmin(groupId) {
        const botNumber = this.client.user.id.split(":")[0] + "@s.whatsapp.net";
        return this.isGroupAdmin(groupId, botNumber);
    }

    /**
     * Update group settings (open/close) using queue
     */
    async updateGroupSettings(groupId, setting) {
        return groupQueue.add(async () => {
            try {
                return await this.client.groupSettingUpdate(groupId, setting);
            } catch (error) {
                logger.error(`Failed to update group settings for ${groupId}`, error);
                throw error;
            }
        });
    }

    /**
     * Close group (only admins can send messages)
     */
    async closeGroup(groupId) {
        return this.updateGroupSettings(groupId, "announcement");
    }

    /**
     * Open group (all members can send messages)
     */
    async openGroup(groupId) {
        return this.updateGroupSettings(groupId, "not_announcement");
    }

    /**
     * Check if welcome is enabled
     */
    isWelcomeEnabled(groupId) {
        const welcome = this.welcomeManager.getWelcomeDb();
        return this.welcomeManager.isWelcomeEnabled(groupId, welcome);
    }

    /**
     * Enable welcome for group
     */
    enableWelcome(groupId) {
        const welcome = this.welcomeManager.getWelcomeDb();
        if (!this.welcomeManager.isWelcomeEnabled(groupId, welcome)) {
            this.welcomeManager.enableWelcome(groupId, welcome);
            return true;
        }
        return false;
    }

    /**
     * Disable welcome for group
     */
    disableWelcome(groupId) {
        const welcome = this.welcomeManager.getWelcomeDb();
        if (this.welcomeManager.isWelcomeEnabled(groupId, welcome)) {
            this.welcomeManager.disableWelcome(groupId, welcome);
            return true;
        }
        return false;
    }

    /**
     * Remove participant from group using queue
     */
    async removeParticipant(groupId, participantId) {
        return groupQueue.add(async () => {
            try {
                return await this.client.groupParticipantsUpdate(groupId, [participantId], "remove");
            } catch (error) {
                logger.error(`Failed to remove participant ${participantId} from ${groupId}`, error);
                throw error;
            }
        });
    }

    /**
     * Add participant to group using queue
     */
    async addParticipant(groupId, participantId) {
        return groupQueue.add(async () => {
            try {
                return await this.client.groupParticipantsUpdate(groupId, [participantId], "add");
            } catch (error) {
                logger.error(`Failed to add participant ${participantId} to ${groupId}`, error);
                throw error;
            }
        });
    }

    /**
     * Promote participant to admin using queue
     */
    async promoteParticipant(groupId, participantId) {
        return groupQueue.add(async () => {
            try {
                return await this.client.groupParticipantsUpdate(groupId, [participantId], "promote");
            } catch (error) {
                logger.error(`Failed to promote participant ${participantId} in ${groupId}`, error);
                throw error;
            }
        });
    }

    /**
     * Demote participant from admin using queue
     */
    async demoteParticipant(groupId, participantId) {
        return groupQueue.add(async () => {
            try {
                return await this.client.groupParticipantsUpdate(groupId, [participantId], "demote");
            } catch (error) {
                logger.error(`Failed to demote participant ${participantId} in ${groupId}`, error);
                throw error;
            }
        });
    }

    /**
     * Get group invite code using queue
     */
    async getGroupInviteCode(groupId) {
        return groupQueue.add(async () => {
            try {
                return await this.client.groupInviteCode(groupId);
            } catch (error) {
                logger.error(`Failed to get invite code for ${groupId}`, error);
                throw error;
            }
        });
    }

    /**
     * Revoke group invite code using queue
     */
    async revokeGroupInviteCode(groupId) {
        return groupQueue.add(async () => {
            try {
                return await this.client.groupRevokeInvite(groupId);
            } catch (error) {
                logger.error(`Failed to revoke invite code for ${groupId}`, error);
                throw error;
            }
        });
    }

    /**
     * Update group subject (name) using queue
     */
    async updateGroupSubject(groupId, subject) {
        return groupQueue.add(async () => {
            try {
                return await this.client.groupUpdateSubject(groupId, subject);
            } catch (error) {
                logger.error(`Failed to update subject for ${groupId}`, error);
                throw error;
            }
        });
    }

    /**
     * Update group description using queue
     */
    async updateGroupDescription(groupId, description) {
        return groupQueue.add(async () => {
            try {
                return await this.client.groupUpdateDescription(groupId, description);
            } catch (error) {
                logger.error(`Failed to update description for ${groupId}`, error);
                throw error;
            }
        });
    }

    /**
     * Leave group using queue
     */
    async leaveGroup(groupId) {
        return groupQueue.add(async () => {
            try {
                return await this.client.groupLeave(groupId);
            } catch (error) {
                logger.error(`Failed to leave group ${groupId}`, error);
                throw error;
            }
        });
    }
}

export default GroupService; 
