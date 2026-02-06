import { axiosPrivate } from "@/axios/axios"
import { useEffect, useState } from "react"
import { d, e } from "../utils/crypto"

const HotelUploadAssets = () => {
    const [propertyImages, setPropertyImages] = useState<File[]>([])
    const [hotelId, setHotelId] = useState<string>("8c608176-681e-45ae-99fd-b9068f5f0dfc");

    const [roomTypes, setRoomTypes] = useState([]);

    const [rooms, setRooms] = useState(
        roomTypes?.map((room) => ({
            roomType: room,
            images: [] as File[],
            amenities: [] as string[],
        }))
    );

    const [amenitiesFromDB, setAmenitiesFromDB] = useState<any[]>([]);

    /* ---------------- Handlers ---------------- */

    const handlePropertyImages = (files: FileList | null) => {
        if (!files) return
        setPropertyImages((prev) => [...prev, ...Array.from(files)])
    }

    const handleRoomImages = (index: number, files: FileList | null) => {
        if (!files) return
        const updated = [...rooms]
        updated[index].images.push(...Array.from(files))
        setRooms(updated)
    }

    const toggleRoomAmenity = (index: number, id: string) => {
        const updated = [...rooms]
        updated[index].amenities = updated[index].amenities.includes(id)
            ? updated[index].amenities.filter((a) => a !== id)
            : [...updated[index].amenities, id]
        setRooms(updated)
    }

    const fetchAmenities = async () => {
        const payload = {
            scope: "PROPERTY"
        }
        const response = await axiosPrivate.post("/api/hotels/amenities", await e(payload));
        const data = JSON.parse(await d(response.data));
        setAmenitiesFromDB(data);
    };

    const fetchRoomTypes = async () => {
        const response = await axiosPrivate.get(`/api/hotels/${hotelId}/room-types`);
        const data = JSON.parse(await d(response.data));
        setRoomTypes(data);
    };

    const handleSubmit = async () => {
        const payload = {
            propertyImages,
            rooms,
        }

        console.log("UPLOAD PAYLOAD 👉", payload)

        // createing form data
        const formData = new FormData();
        propertyImages.forEach((image) => formData.append("propertyImages", image));

        const roomsPayload: any[] = [];
        let roomImageIndex = 0;

        rooms.forEach((room) => {
            const imageIndexes: number[] = [];

            room.images.forEach(() => {
                imageIndexes.push(roomImageIndex);
                roomImageIndex++;
            });

            roomsPayload.push({
                roomType: room.roomType,
                imageIndexes,
                amenities: room.amenities,
            });
        });

        const roomData = {
            rooms: roomsPayload,
        };

        // metadata
        formData.append("data", await e(roomData));

        // property images
        propertyImages.forEach((img) =>
            formData.append("propertyImages", img)
        );

        // room images (flattened)
        rooms.forEach((room) => {
            room.images.forEach((img) => {
                formData.append("roomImages", img);
            });
        });

        const response = await axiosPrivate.post(`/api/hotels/${hotelId}/assets`, formData);
        // const data = JSON.parse(await d(response.data));
        // console.log("UPLOAD RESPONSE 👉", data);

    }

    useEffect(() => {
        fetchAmenities();
        fetchRoomTypes();
    }, []);
    useEffect(() => {
        setRooms(
            roomTypes.map((roomType) => ({
                roomType,
                images: [],
                amenities: [],
            }))
        );
    }, [roomTypes]);


    return (
        <div className="space-y-8 p-6">
            <h2 className="text-xl font-semibold">Hotel Assets & Amenities</h2>

            {/* ---------------- Property Images ---------------- */}
            <section>
                <h3 className="font-medium mb-2">Property Images</h3>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handlePropertyImages(e.target.files)}
                />
                <p className="text-sm text-gray-500 mt-1">
                    Uploaded: {propertyImages.length} images
                </p>
            </section>

            {/* ---------------- Room Wise Assets ---------------- */}
            {rooms.map((room, index) => (
                <section key={room.roomType} className="border rounded-md p-4">
                    <h3 className="font-medium mb-3">{room.roomType}</h3>

                    {/* Room Images */}
                    <div className="mb-4">
                        <label className="block mb-1">Room Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleRoomImages(index, e.target.files)}
                        />
                        <p className="text-sm text-gray-500">
                            Uploaded: {room.images.length} images
                        </p>
                    </div>

                    {/* Room Amenities */}
                    <div className="flex flex-wrap gap-3">
                        {amenitiesFromDB.map((amenity) => (
                            <label key={amenity.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={room.amenities.includes(amenity.id)}
                                    onChange={() => toggleRoomAmenity(index, amenity.id)}
                                />
                                {amenity.name}
                            </label>
                        ))}
                    </div>
                </section>
            ))}

            {/* ---------------- Submit ---------------- */}
            <div className="pt-4">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-black text-white rounded-md"
                >
                    Save & Upload
                </button>
            </div>
        </div>
    )
}

export default HotelUploadAssets



type Amenity = {
    id: string
    name: string
}