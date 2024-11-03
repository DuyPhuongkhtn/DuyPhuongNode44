import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { VideoType } from "../enum/video_type.enum";

export class CreateVideoDto {
    @IsNotEmpty({message: "Video name không được để trống"})
    @ApiProperty() // show property ra giao diện swagger
    video_name: string;

    @IsNotEmpty({message: "thumbnail không được để trống"})
    @ApiProperty() // show property ra giao diện swagger
    thumbnail: string;

    @IsNotEmpty({message: "Mô tả không được để trống"})
    @ApiProperty() // show property ra giao diện swagger
    description: string;

    @ApiProperty()
    views: number;

    @IsNotEmpty({message: "Source video không được để trống"})
    @ApiProperty() // show property ra giao diện swagger
    source: string;

    user_id: number;

    @ApiProperty({enum: VideoType})
    @IsEnum(VideoType)
    type_id: number;
}

export class FileUploadDto {
    @ApiProperty({type: 'string', format: 'binary'})
    hinhAnh: any;
}

// define Dto up nhiều hình

export class FilesUploadDto {
    @ApiProperty({type: 'array', items: { type: 'string', format: 'binary'}})
    hinhAnh: any[];
}