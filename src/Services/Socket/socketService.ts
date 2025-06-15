import { io, Socket } from 'socket.io-client';
import { Store } from '@reduxjs/toolkit';
import {
    setConnectionStatus,
    setCurrentAuction,
    updateAuctionState,
    addUserBid,
    setError,
    setBidError
} from '../../State/Slices/biddingSlice';
import { BiddingSocketEvents, PlaceBidRequest } from '../../Types/biddingTypes';

class SocketService {
    private socket: Socket<BiddingSocketEvents> | null = null;
    private store: Store | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    initialize(store: Store): void {
        this.store = store;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                reject(new Error('No authentication token found'));
                return;
            }

            const socketUrl = 'http://localhost:8000';

            this.socket = io(socketUrl, {
                auth: {
                    token: token
                },
                transports: ['websocket', 'polling'],
                timeout: 10000,
                retries: 3,
            });

            // Connection successful
            this.socket.on('connect', () => {
                console.log('Socket connected:', this.socket?.id);
                this.reconnectAttempts = 0;
                this.store?.dispatch(setConnectionStatus(true));
                resolve();
            });

            // Connection failed
            this.socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                this.store?.dispatch(setConnectionStatus(false));
                this.store?.dispatch(setError('Failed to connect to bidding server'));
                reject(error);
            });

            // Disconnection
            this.socket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                this.store?.dispatch(setConnectionStatus(false));

                // Attempt to reconnect
                if (reason === 'io server disconnect') {
                    // Server disconnected the client, don't reconnect
                    this.store?.dispatch(setError('Disconnected by server'));
                } else {
                    // Client disconnected, attempt to reconnect
                    this.attemptReconnect();
                }
            });

            // Auction state events
            this.socket.on('auctionState', (data) => {
                console.log('Received auction state:', data);
                this.store?.dispatch(setCurrentAuction(data));
            });

            this.socket.on('auctionUpdate', (data) => {
                console.log('Received auction update:', data);
                this.store?.dispatch(updateAuctionState(data));
            });

            // Bid events
            this.socket.on('bidPlaced', (data) => {
                console.log('Bid placed successfully:', data);
                if (data.success && data.bid) {
                    this.store?.dispatch(addUserBid(data.bid));
                }
            });

            this.socket.on('bidError', (data) => {
                console.error('Bid error:', data.message);
                this.store?.dispatch(setBidError(data.message));
            });

            // General error events
            this.socket.on('error', (data) => {
                console.error('Socket error:', data.message);
                this.store?.dispatch(setError(data.message));
            });
        });
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

            setTimeout(() => {
                this.connect().catch((error) => {
                    console.error('Reconnection attempt failed:', error);
                    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                        this.store?.dispatch(setError('Failed to reconnect to bidding server'));
                    }
                });
            }, this.reconnectDelay * this.reconnectAttempts);
        }
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.store?.dispatch(setConnectionStatus(false));
        }
    }

    joinAuction(productId: string): void {
        if (!this.socket?.connected) {
            this.store?.dispatch(setError('Not connected to bidding server'));
            return;
        }

        console.log('Joining auction:', productId);
        this.socket.emit('joinAuction', productId);
    }

    leaveAuction(productId: string): void {
        if (!this.socket?.connected) {
            return;
        }

        console.log('Leaving auction:', productId);
        this.socket.emit('leaveAuction', productId);
    }

    placeBid(bidData: PlaceBidRequest): void {
        if (!this.socket?.connected) {
            this.store?.dispatch(setBidError('Not connected to bidding server'));
            return;
        }

        console.log('Placing bid:', bidData);
        this.socket.emit('placeBid', bidData);
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    getSocketId(): string | null {
        return this.socket?.id ?? null;
    }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;