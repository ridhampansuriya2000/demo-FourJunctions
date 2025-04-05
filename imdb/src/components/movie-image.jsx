import { useState } from "react";
import Image from "next/image";

const MovieImage = ({ src, alt, className = "" }) => {
    const defaultImage = "/movie-poster.jpeg?height=200&width=400";
    const [imageSrc, setImageSrc] = useState(src || defaultImage);

    return (
        <div className={`relative h-[200px] w-full ${className}`}>
            <Image
                src={imageSrc}
                alt={alt}
                fill
                className="object-cover"
                onError={() => setImageSrc(defaultImage)}
            />
        </div>
    );
};

export default MovieImage;