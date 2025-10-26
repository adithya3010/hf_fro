import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Plus, Loader2, Users, Calendar, Check } from 'lucide-react';
import { toast } from 'sonner';
import BackgroundOverlay from './BackgroundOverlay';

export function RoomList({ rooms, currentRoom, onRoomSelect, onCreateRoom }) {
    const [newRoomName, setNewRoomName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        const name = newRoomName.trim();
        if (!name) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await onCreateRoom(name);
            setNewRoomName('');
            setIsCreating(false);
            toast.success('Room created successfully!');
        } catch (err) {
            setError(err.message || 'Failed to create room');
            toast.error(err.message || 'Failed to create room');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative h-full w-full">
            <BackgroundOverlay />
            <div className="h-full relative z-10 flex flex-col bg-white/10 dark:bg-slate-950/50 rounded-lg overflow-hidden backdrop-blur-xl border border-white/20 shadow-2xl">

                <div className="p-6 border-b border-white/10 dark:border-slate-800/50 bg-gradient-to-br from-indigo-500/10 to-indigo-900/10">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Users className="w-6 h-6 text-indigo-400" />
                        Chat Rooms
                    </h2>
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-600 text-white hover:from-indigo-700 hover:to-indigo-700 transition-all duration-300 border border-indigo-400/20 shadow-lg shadow-indigo-950/30 hover:shadow-xl hover:shadow-indigo-900/40 hover:scale-[1.02]"
                        disabled={isCreating || isSubmitting}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Room
                    </Button>
                </div>

                <AnimatePresence>
                    {isCreating && (
                        <motion.form
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            onSubmit={handleCreateRoom}
                            className="p-4 border-b border-white/10 dark:border-slate-800/50 bg-gradient-to-br from-indigo-500/20 to-indigo-900/20 backdrop-blur-sm"
                        >
                            <input
                                type="text"
                                value={newRoomName}
                                onChange={(e) => {
                                    setNewRoomName(e.target.value);
                                    setError(null);
                                }}
                                placeholder="Enter room name..."
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 dark:bg-slate-950/50 text-white placeholder-white/50 backdrop-blur-xl transition-all duration-200 hover:bg-white/20 dark:hover:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 ${error ? 'border-red-500' : 'border-white/10 dark:border-slate-800/50'
                                    }`}
                                disabled={isSubmitting}
                                autoFocus
                            />
                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-red-400 mt-2 flex items-center"
                                >
                                    <span className="bg-red-500/10 p-1 rounded-full mr-2">⚠</span>
                                    {error}
                                </motion.p>
                            )}
                            <div className="flex gap-2 mt-4">
                                <Button
                                    type="submit"
                                    disabled={!newRoomName.trim() || isSubmitting}
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-600 text-white hover:from-indigo-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Create
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setError(null);
                                    }}
                                    disabled={isSubmitting}
                                    className="text-white hover:bg-white/10 transition-all duration-200"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">
                    <AnimatePresence>
                        {rooms.map((room, index) => (
                            <motion.div
                                key={room._id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`group relative p-4 flex items-center gap-4 border-b border-white/10 cursor-pointer last:border-b-0 transition-all duration-300 ${
                                    room._id === currentRoom?._id 
                                        ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-900/20 border-l-4 border-l-indigo-400 shadow-lg shadow-indigo-500/10' 
                                        : 'hover:bg-white/5 dark:hover:bg-slate-800/50 hover:border-l-4 hover:border-l-indigo-400/50'
                                }`}
                                onClick={() => onRoomSelect(room)}
                            >
                                {/* Room Icon/Avatar */}
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    room._id === currentRoom?._id
                                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-900 shadow-lg shadow-indigo-500/50'
                                        : 'bg-gradient-to-br from-indigo-600/50 to-indigo-900/50 group-hover:from-indigo-500/60 group-hover:to-indigo-900/60'
                                }`}>
                                    <span className="text-xl font-bold text-white">
                                        {room.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                {/* Room Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-white/95 truncate group-hover:text-white transition-colors">
                                        {room.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                                        <Users className="w-3 h-3" />
                                        <span className="truncate">by {room.createdBy}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-white/40 mt-0.5">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(room.createdAt).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: new Date(room.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                        })}</span>
                                    </div>
                                </div>

                                {/* Active Indicator */}
                                {room._id === currentRoom?._id && (
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex-shrink-0 w-2 h-2 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50"
                                    />
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {rooms.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-12 text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-900/20 flex items-center justify-center">
                                <Users className="w-8 h-8 text-indigo-400/50" />
                            </div>
                            <p className="text-white/50 text-sm">
                                No rooms available.<br />
                                <span className="text-white/70">Create one to get started!</span>
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
